import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { PRISMA_ERROR, isPrismaError } from '@common/prisma-errors'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// Every read returns the product with its category attached. Using `include`
// (not `select`) means new schema columns flow through without touching this file.
const productInclude = {
  category: { select: { id: true, name: true } }
} as const

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: typeof productInclude
}>

// Same shape, except `price` is a JSON number instead of a Prisma Decimal.
// Derived from the Prisma type so a schema change can never silently drift.
type ProductResponse = Omit<ProductWithCategory, 'price'> & { price: number }

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(sellerId: string) {
    const products = await this.prisma.product.findMany({
      where: { sellerId, archivedAt: null },
      include: productInclude,
      orderBy: { createdAt: 'desc' }
    })
    return products.map((product) => this.serialize(product))
  }

  async findOne(sellerId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, sellerId, archivedAt: null },
      include: productInclude
    })
    if (!product) throw new NotFoundException('Product not found')
    return this.serialize(product)
  }

  async create(sellerId: string, dto: CreateProductDto) {
    await this.assertCategoryOwned(sellerId, dto.categoryId)

    const product = await this.prisma.product.create({
      data: {
        sellerId,
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity ?? 0,
        categoryId: dto.categoryId ?? null
      },
      include: productInclude
    })
    return this.serialize(product)
  }

  async update(sellerId: string, id: string, dto: UpdateProductDto) {
    await this.findOne(sellerId, id)
    // `categoryId: null` uncategorizes; an absent key leaves the category alone.
    if ('categoryId' in dto) {
      await this.assertCategoryOwned(sellerId, dto.categoryId)
    }

    const product = await this.prisma.product.update({
      where: { id },
      // Fields are picked one by one so a caller can never reassign ownership.
      // Prisma ignores `undefined`, so absent keys leave their column alone.
      data: {
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
        ...('categoryId' in dto ? { categoryId: dto.categoryId ?? null } : {})
      },
      include: productInclude
    })
    return this.serialize(product)
  }

  // A product that was never sold is deleted outright. One that appears in a
  // sale is archived instead: SaleItem.productId is Restrict, and erasing the
  // product would take its sales history with it.
  async remove(sellerId: string, id: string) {
    await this.findOne(sellerId, id)

    const soldLines = await this.prisma.saleItem.count({ where: { productId: id } })
    if (soldLines > 0) {
      await this.archive(id)
      return { message: 'Product deleted' }
    }

    try {
      await this.prisma.product.delete({ where: { id } })
    } catch (error) {
      // A sale landed between the count and the delete; the FK stopped us, so
      // fall back to archiving rather than failing the request.
      if (!isPrismaError(error, PRISMA_ERROR.FOREIGN_KEY_VIOLATION)) throw error
      await this.archive(id)
    }
    return { message: 'Product deleted' }
  }

  private archive(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { archivedAt: new Date() }
    })
  }

  // A seller must not be able to attach someone else's category to a product.
  private async assertCategoryOwned(
    sellerId: string,
    categoryId?: string | null
  ) {
    if (categoryId == null) return

    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, sellerId },
      select: { id: true }
    })
    if (!category) throw new BadRequestException('Category not found')
  }

  private serialize(product: ProductWithCategory): ProductResponse {
    return { ...product, price: Number(product.price) }
  }
}
