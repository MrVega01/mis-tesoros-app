import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Prisma, SaleStatus } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateSaleDto, SaleItemDto } from './dto/create-sale.dto'

const saleInclude = { items: true } as const

type SaleWithItems = Prisma.SaleGetPayload<{ include: typeof saleInclude }>
type SaleItemRow = SaleWithItems['items'][number]

// Same rows, with the Decimal columns as JSON numbers. Derived from the Prisma
// types so a schema change cannot silently drift.
type SaleResponse = Omit<
  SaleWithItems,
  'totalUsd' | 'exchangeRate' | 'items'
> & {
  totalUsd: number
  exchangeRate: number | null
  items: (Omit<SaleItemRow, 'unitPrice'> & { unitPrice: number })[]
}

/**
 * Collapses repeated productIds into one line each, summing their quantities.
 * Required by the @@unique([saleId, productId]) constraint, and it lets a
 * client send the same product twice without thinking about it.
 */
function aggregateItems(items: SaleItemDto[]) {
  const merged = new Map<string, number>()
  for (const item of items) {
    merged.set(
      item.productId,
      (merged.get(item.productId) ?? 0) + item.quantity
    )
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }))
}

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async findAll(sellerId: string) {
    const sales = await this.prisma.sale.findMany({
      where: { sellerId },
      include: saleInclude,
      orderBy: { createdAt: 'desc' }
    })
    return sales.map((sale) => this.serialize(sale))
  }

  async findOne(sellerId: string, id: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, sellerId },
      include: saleInclude
    })
    if (!sale) throw new NotFoundException('Sale not found')
    return this.serialize(sale)
  }

  async create(sellerId: string, dto: CreateSaleDto) {
    const items = aggregateItems(dto.items)

    const sale = await this.prisma.$transaction(async (tx) => {
      // 1. Read the products up front: proves ownership, filters out archived
      //    ones, captures the price/name snapshots, and lets the stock error
      //    name the product that is short instead of just failing.
      const products = await tx.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
          sellerId,
          archivedAt: null
        }
      })
      const byId = new Map(products.map((product) => [product.id, product]))

      const missing = items.filter((item) => !byId.has(item.productId))
      if (missing.length > 0) {
        throw new BadRequestException(
          `Product not found: ${missing.map((item) => item.productId).join(', ')}`
        )
      }

      const short = items.filter(
        (item) => byId.get(item.productId)!.quantity < item.quantity
      )
      if (short.length > 0) {
        throw new BadRequestException(
          `Not enough stock for: ${short
            .map((item) => byId.get(item.productId)!.name)
            .join(', ')}`
        )
      }

      // 2. Decrement with the quantity as a guard. This is a compare-and-swap,
      //    not a write: if another sale took the stock since step 1, `count` is
      //    0 and the whole transaction rolls back rather than overselling.
      for (const item of items) {
        const { count } = await tx.product.updateMany({
          where: {
            id: item.productId,
            sellerId,
            archivedAt: null,
            quantity: { gte: item.quantity }
          },
          data: { quantity: { decrement: item.quantity } }
        })
        if (count === 0) {
          throw new ConflictException(
            `Stock for "${byId.get(item.productId)!.name}" changed, please try again`
          )
        }
      }

      // Taken from the seller's saved rate, never from the request, so the
      // recorded rate cannot be forged by the client.
      const profile = await tx.sellerProfile.findUnique({
        where: { userId: sellerId },
        select: { customTaxRate: true }
      })

      // Decimal, not float — this is money.
      const totalUsd = items.reduce(
        (total, item) =>
          total.add(
            new Prisma.Decimal(byId.get(item.productId)!.price).mul(
              item.quantity
            )
          ),
        new Prisma.Decimal(0)
      )

      return tx.sale.create({
        data: {
          sellerId,
          customerId: null,
          totalUsd,
          exchangeRate: profile?.customTaxRate ?? null,
          items: {
            create: items.map((item) => {
              const product = byId.get(item.productId)!
              return {
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
                productName: product.name
              }
            })
          }
        },
        include: saleInclude
      })
    })

    return this.serialize(sale)
  }

  /**
   * Puts every sold unit back. Reverting is the only way to undo a sale — there
   * is no delete — and it can only happen once.
   */
  async revert(sellerId: string, id: string) {
    const sale = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.sale.findFirst({
        where: { id, sellerId },
        include: saleInclude
      })
      if (!existing) throw new NotFoundException('Sale not found')
      if (existing.status === SaleStatus.REVERTED) {
        throw new ConflictException('Sale is already reverted')
      }

      // Safe without a guard: increments cannot fail, and the Restrict FK on
      // SaleItem.productId guarantees every product row still exists.
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } }
        })
      }

      return tx.sale.update({
        where: { id },
        data: { status: SaleStatus.REVERTED, revertedAt: new Date() },
        include: saleInclude
      })
    })

    return this.serialize(sale)
  }

  private serialize(sale: SaleWithItems): SaleResponse {
    return {
      ...sale,
      totalUsd: Number(sale.totalUsd),
      exchangeRate:
        sale.exchangeRate === null ? null : Number(sale.exchangeRate),
      items: sale.items.map((item) => ({
        ...item,
        unitPrice: Number(item.unitPrice)
      }))
    }
  }
}
