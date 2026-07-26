import { Test, TestingModule } from '@nestjs/testing'
import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common'
import { Prisma, SaleStatus } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { SaleService } from './sale.service'
import { CreateSaleDto } from './dto/create-sale.dto'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SELLER_ID = 'seller-1'
const OTHER_SELLER_ID = 'seller-2'
const SALE_ID = 'sale-1'
const PRODUCT_ID = 'product-1'
const OTHER_PRODUCT_ID = 'product-2'

// `price` is a Prisma Decimal in the DB, never a plain number.
function makeDbProduct(overrides: Record<string, any> = {}) {
  return {
    id: PRODUCT_ID,
    sellerId: SELLER_ID,
    name: 'Collar de perlas',
    price: new Prisma.Decimal('12.50'),
    quantity: 10,
    categoryId: null,
    archivedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides
  }
}

function makeDbSaleItem(overrides: Record<string, any> = {}) {
  return {
    id: 'sale-item-1',
    saleId: SALE_ID,
    productId: PRODUCT_ID,
    quantity: 2,
    unitPrice: new Prisma.Decimal('12.50'),
    productName: 'Collar de perlas',
    ...overrides
  }
}

function makeDbSale(overrides: Record<string, any> = {}) {
  return {
    id: SALE_ID,
    status: SaleStatus.ACTIVE,
    totalUsd: new Prisma.Decimal('25.00'),
    exchangeRate: new Prisma.Decimal('36.50'),
    revertedAt: null,
    sellerId: SELLER_ID,
    customerId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    items: [makeDbSaleItem()],
    ...overrides
  }
}

// ─── Mock providers ───────────────────────────────────────────────────────────

// The object the `$transaction` callback receives. Every write the service
// performs inside a transaction must land here, never on `mockPrisma`.
const mockTx = {
  product: {
    findMany: jest.fn(),
    updateMany: jest.fn(),
    update: jest.fn()
  },
  sellerProfile: {
    findUnique: jest.fn()
  },
  sale: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

const mockPrisma = {
  sale: {
    findMany: jest.fn(),
    findFirst: jest.fn()
  },
  $transaction: jest.fn()
}

// The payload the service builds for `sale.create`, narrowed so assertions on
// the captured call arguments stay type-safe.
type CreatedSaleData = {
  sellerId: string
  customerId: string | null
  totalUsd: Prisma.Decimal
  exchangeRate: Prisma.Decimal | null
  items: {
    create: {
      productId: string
      quantity: number
      unitPrice: Prisma.Decimal
      productName: string
    }[]
  }
}

function capturedSaleData(): CreatedSaleData {
  const calls = mockTx.sale.create.mock.calls as [{ data: CreatedSaleData }][]
  return calls[0][0].data
}

// A request body a client could forge, past the DTO's own typing.
function forgedDto(body: Record<string, unknown>): CreateSaleDto {
  return body as unknown as CreateSaleDto
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('SaleService', () => {
  let service: SaleService

  beforeEach(async () => {
    jest.clearAllMocks()

    // Real Prisma runs the callback and rolls back if it throws; here it just
    // runs, so a thrown error surfacing at the caller is the rollback contract.
    mockPrisma.$transaction.mockImplementation(
      (callback: (tx: typeof mockTx) => unknown) => callback(mockTx)
    )
    // Sensible defaults: stock is plentiful, the guarded decrement wins, and
    // the seller has a saved rate.
    mockTx.product.updateMany.mockResolvedValue({ count: 1 })
    mockTx.product.update.mockResolvedValue(makeDbProduct())
    mockTx.sellerProfile.findUnique.mockResolvedValue({
      customTaxRate: new Prisma.Decimal('36.50')
    })
    mockTx.sale.create.mockResolvedValue(makeDbSale())
    mockTx.sale.update.mockResolvedValue(
      makeDbSale({ status: SaleStatus.REVERTED, revertedAt: new Date() })
    )

    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleService, { provide: PrismaService, useValue: mockPrisma }]
    }).compile()

    service = module.get<SaleService>(SaleService)
  })

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('scopes the query to the requesting seller and returns newest first', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([makeDbSale()])

      await service.findAll(SELLER_ID)

      expect(mockPrisma.sale.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { sellerId: SELLER_ID },
          orderBy: { createdAt: 'desc' }
        })
      )
    })

    it('returns an empty array when the seller has never sold anything', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([])

      await expect(service.findAll(SELLER_ID)).resolves.toEqual([])
    })

    it('serializes every Decimal column to a plain number', async () => {
      mockPrisma.sale.findMany.mockResolvedValue([makeDbSale()])

      const [sale] = await service.findAll(SELLER_ID)

      expect(typeof sale.totalUsd).toBe('number')
      expect(typeof sale.exchangeRate).toBe('number')
      expect(typeof sale.items[0].unitPrice).toBe('number')
      expect(sale.totalUsd).toBe(25)
      expect(sale.exchangeRate).toBe(36.5)
      expect(sale.items[0].unitPrice).toBe(12.5)
    })

    it('does not swallow database errors', async () => {
      mockPrisma.sale.findMany.mockRejectedValue(new Error('db unavailable'))

      await expect(service.findAll(SELLER_ID)).rejects.toThrow('db unavailable')
    })
  })

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('scopes the lookup by both id and sellerId', async () => {
      mockPrisma.sale.findFirst.mockResolvedValue(makeDbSale())

      await service.findOne(SELLER_ID, SALE_ID)

      expect(mockPrisma.sale.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: SALE_ID, sellerId: SELLER_ID } })
      )
    })

    it('throws NotFoundException when the sale does not exist', async () => {
      mockPrisma.sale.findFirst.mockResolvedValue(null)

      await expect(service.findOne(SELLER_ID, 'missing')).rejects.toThrow(
        NotFoundException
      )
    })

    it('throws NotFoundException when the sale belongs to another seller', async () => {
      // The sellerId filter makes the row invisible, so Prisma returns null.
      mockPrisma.sale.findFirst.mockResolvedValue(null)

      await expect(service.findOne(OTHER_SELLER_ID, SALE_ID)).rejects.toThrow(
        NotFoundException
      )
      expect(mockPrisma.sale.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: SALE_ID, sellerId: OTHER_SELLER_ID }
        })
      )
    })

    it('keeps an unset exchange rate as null rather than coercing it to 0', async () => {
      mockPrisma.sale.findFirst.mockResolvedValue(
        makeDbSale({ exchangeRate: null })
      )

      const sale = await service.findOne(SELLER_ID, SALE_ID)

      expect(sale.exchangeRate).toBeNull()
    })
  })

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('runs the whole checkout inside a single transaction', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 2 }]
      })

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1)
    })

    it('propagates an error thrown inside the transaction so it rolls back', async () => {
      mockTx.product.findMany.mockRejectedValue(new Error('db unavailable'))

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 1 }]
        })
      ).rejects.toThrow('db unavailable')
      expect(mockTx.sale.create).not.toHaveBeenCalled()
    })

    // ─── Pre-read scoping ────────────────────────────────────────────────────

    it('reads the products scoped to the seller and excluding archived ones', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 1 }]
      })

      expect(mockTx.product.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: [PRODUCT_ID] },
          sellerId: SELLER_ID,
          archivedAt: null
        }
      })
    })

    it('throws BadRequestException naming the product when it does not exist', async () => {
      mockTx.product.findMany.mockResolvedValue([])

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: 'ghost-product', quantity: 1 }]
        })
      ).rejects.toThrow(
        new BadRequestException('Product not found: ghost-product')
      )
    })

    it('does not decrement anything when a product is unknown', async () => {
      mockTx.product.findMany.mockResolvedValue([])

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: 'ghost-product', quantity: 1 }]
        })
      ).rejects.toThrow(BadRequestException)
      expect(mockTx.product.updateMany).not.toHaveBeenCalled()
      expect(mockTx.sale.create).not.toHaveBeenCalled()
    })

    it("treats another seller's product as not found", async () => {
      // The sellerId filter hides the row, so the pre-read comes back empty.
      mockTx.product.findMany.mockResolvedValue([])

      await expect(
        service.create(OTHER_SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 1 }]
        })
      ).rejects.toThrow(
        new BadRequestException(`Product not found: ${PRODUCT_ID}`)
      )
    })

    it('treats an archived product as not found', async () => {
      // `archivedAt: null` in the where clause keeps archived rows out.
      mockTx.product.findMany.mockResolvedValue([])

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 1 }]
        })
      ).rejects.toThrow(BadRequestException)
      expect(mockTx.product.updateMany).not.toHaveBeenCalled()
    })

    it('names every missing product, not just the first', async () => {
      mockTx.product.findMany.mockResolvedValue([])

      await expect(
        service.create(SELLER_ID, {
          items: [
            { productId: 'ghost-a', quantity: 1 },
            { productId: 'ghost-b', quantity: 1 }
          ]
        })
      ).rejects.toThrow('Product not found: ghost-a, ghost-b')
    })

    // ─── Stock ───────────────────────────────────────────────────────────────

    it('throws BadRequestException naming the product when stock is insufficient', async () => {
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct({ quantity: 1 })
      ])

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 2 }]
        })
      ).rejects.toThrow(
        new BadRequestException('Not enough stock for: Collar de perlas')
      )
      expect(mockTx.product.updateMany).not.toHaveBeenCalled()
      expect(mockTx.sale.create).not.toHaveBeenCalled()
    })

    it('rejects a product that is completely out of stock', async () => {
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct({ quantity: 0 })
      ])

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 1 }]
        })
      ).rejects.toThrow(BadRequestException)
    })

    it('allows a sale that takes the very last unit in stock', async () => {
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct({ quantity: 2 })
      ])

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 2 }]
      })

      expect(mockTx.sale.create).toHaveBeenCalledTimes(1)
    })

    it('checks stock against the summed quantity of duplicated lines', async () => {
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct({ quantity: 3 })
      ])

      await expect(
        service.create(SELLER_ID, {
          items: [
            { productId: PRODUCT_ID, quantity: 2 },
            { productId: PRODUCT_ID, quantity: 2 }
          ]
        })
      ).rejects.toThrow(BadRequestException)
    })

    // ─── Guarded decrement ───────────────────────────────────────────────────

    it('decrements stock with the quantity as a compare-and-swap guard', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 2 }]
      })

      expect(mockTx.product.updateMany).toHaveBeenCalledWith({
        where: {
          id: PRODUCT_ID,
          sellerId: SELLER_ID,
          archivedAt: null,
          quantity: { gte: 2 }
        },
        data: { quantity: { decrement: 2 } }
      })
    })

    it('throws ConflictException when the guarded decrement matches no row', async () => {
      // Another sale drained the stock between the pre-read and the update.
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.product.updateMany.mockResolvedValue({ count: 0 })

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 2 }]
        })
      ).rejects.toThrow(ConflictException)
    })

    it('names the contended product and creates no sale when the stock race is lost', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.product.updateMany.mockResolvedValue({ count: 0 })

      await expect(
        service.create(SELLER_ID, {
          items: [{ productId: PRODUCT_ID, quantity: 2 }]
        })
      ).rejects.toThrow(
        'Stock for "Collar de perlas" changed, please try again'
      )
      expect(mockTx.sale.create).not.toHaveBeenCalled()
    })

    // ─── Duplicate aggregation ───────────────────────────────────────────────

    it('collapses a repeated productId into one line whose quantity is the sum', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 2 },
          { productId: PRODUCT_ID, quantity: 3 }
        ]
      })

      const created = capturedSaleData().items.create
      expect(created).toHaveLength(1)
      expect(created[0]).toEqual(
        expect.objectContaining({ productId: PRODUCT_ID, quantity: 5 })
      )
    })

    it('issues a single decrement for the summed quantity of a repeated product', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 2 },
          { productId: PRODUCT_ID, quantity: 3 }
        ]
      })

      expect(mockTx.product.updateMany).toHaveBeenCalledTimes(1)
      expect(mockTx.product.updateMany).toHaveBeenCalledWith({
        where: {
          id: PRODUCT_ID,
          sellerId: SELLER_ID,
          archivedAt: null,
          quantity: { gte: 5 }
        },
        data: { quantity: { decrement: 5 } }
      })
    })

    it('reads a repeated product only once', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 1 },
          { productId: PRODUCT_ID, quantity: 1 }
        ]
      })

      expect(mockTx.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ id: { in: [PRODUCT_ID] } })
        })
      )
    })

    it('keeps distinct products as separate lines with their own decrements', async () => {
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct(),
        makeDbProduct({
          id: OTHER_PRODUCT_ID,
          name: 'Anillo',
          price: new Prisma.Decimal('5.00')
        })
      ])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 1 },
          { productId: OTHER_PRODUCT_ID, quantity: 4 }
        ]
      })

      expect(mockTx.product.updateMany).toHaveBeenCalledTimes(2)
      expect(capturedSaleData().items.create).toHaveLength(2)
    })

    // ─── Snapshots and totals ────────────────────────────────────────────────

    it('snapshots the unit price and name of the product at sale time', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 2 }]
      })

      const [line] = capturedSaleData().items.create
      expect(line.productName).toBe('Collar de perlas')
      expect(Number(line.unitPrice)).toBe(12.5)
    })

    it('totals the sale as the Decimal sum of price times quantity', async () => {
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct({ price: new Prisma.Decimal('12.50') }),
        makeDbProduct({
          id: OTHER_PRODUCT_ID,
          name: 'Anillo',
          price: new Prisma.Decimal('5.25')
        })
      ])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 2 },
          { productId: OTHER_PRODUCT_ID, quantity: 3 }
        ]
      })

      const { totalUsd } = capturedSaleData()
      expect(Number(totalUsd)).toBe(40.75)
    })

    it('totals with Decimal arithmetic, avoiding float drift', async () => {
      // 0.1 + 0.2 in floats is 0.30000000000000004.
      mockTx.product.findMany.mockResolvedValue([
        makeDbProduct({ price: new Prisma.Decimal('0.10') }),
        makeDbProduct({
          id: OTHER_PRODUCT_ID,
          name: 'Anillo',
          price: new Prisma.Decimal('0.20')
        })
      ])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 1 },
          { productId: OTHER_PRODUCT_ID, quantity: 1 }
        ]
      })

      const { totalUsd } = capturedSaleData()
      expect(totalUsd.toString()).toBe('0.3')
    })

    it('totals a duplicated line once, on the summed quantity', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [
          { productId: PRODUCT_ID, quantity: 2 },
          { productId: PRODUCT_ID, quantity: 3 }
        ]
      })

      const { totalUsd } = capturedSaleData()
      expect(Number(totalUsd)).toBe(62.5)
    })

    // ─── Exchange rate and ownership ─────────────────────────────────────────

    it("records the seller's saved custom tax rate as the exchange rate", async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.sellerProfile.findUnique.mockResolvedValue({
        customTaxRate: new Prisma.Decimal('42.00')
      })

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 1 }]
      })

      expect(mockTx.sellerProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: SELLER_ID },
        select: { customTaxRate: true }
      })
      const { exchangeRate } = capturedSaleData()
      expect(Number(exchangeRate)).toBe(42)
    })

    it('records a null exchange rate when the seller has no saved rate', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.sellerProfile.findUnique.mockResolvedValue({
        customTaxRate: null
      })

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 1 }]
      })

      expect(capturedSaleData().exchangeRate).toBeNull()
    })

    it('records a null exchange rate when the seller has no profile at all', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.sellerProfile.findUnique.mockResolvedValue(null)

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 1 }]
      })

      expect(capturedSaleData().exchangeRate).toBeNull()
    })

    it('never takes the exchange rate from the request body', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.sellerProfile.findUnique.mockResolvedValue({ customTaxRate: null })

      await service.create(
        SELLER_ID,
        forgedDto({
          items: [{ productId: PRODUCT_ID, quantity: 1 }],
          // A client trying to forge the recorded rate.
          exchangeRate: 9999
        })
      )

      expect(capturedSaleData().exchangeRate).toBeNull()
    })

    it('attributes the sale to the authenticated seller and to no customer', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 1 }]
      })

      expect(capturedSaleData()).toEqual(
        expect.objectContaining({ sellerId: SELLER_ID, customerId: null })
      )
    })

    it('ignores a sellerId supplied in the request body', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.create(
        SELLER_ID,
        forgedDto({
          items: [{ productId: PRODUCT_ID, quantity: 1 }],
          sellerId: OTHER_SELLER_ID,
          customerId: 'someone'
        })
      )

      expect(capturedSaleData()).toEqual(
        expect.objectContaining({ sellerId: SELLER_ID, customerId: null })
      )
    })

    it('serializes the created sale to plain numbers', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])

      const sale = await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 2 }]
      })

      expect(typeof sale.totalUsd).toBe('number')
      expect(typeof sale.exchangeRate).toBe('number')
      expect(typeof sale.items[0].unitPrice).toBe('number')
    })

    it('serializes an unset exchange rate as null, not 0', async () => {
      mockTx.product.findMany.mockResolvedValue([makeDbProduct()])
      mockTx.sale.create.mockResolvedValue(makeDbSale({ exchangeRate: null }))

      const sale = await service.create(SELLER_ID, {
        items: [{ productId: PRODUCT_ID, quantity: 2 }]
      })

      expect(sale.exchangeRate).toBeNull()
    })
  })

  // ─── revert ────────────────────────────────────────────────────────────────

  describe('revert', () => {
    it('scopes the sale lookup by both id and sellerId', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale())

      await service.revert(SELLER_ID, SALE_ID)

      expect(mockTx.sale.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: SALE_ID, sellerId: SELLER_ID } })
      )
    })

    it('throws NotFoundException when the sale does not exist', async () => {
      mockTx.sale.findFirst.mockResolvedValue(null)

      await expect(service.revert(SELLER_ID, 'missing')).rejects.toThrow(
        NotFoundException
      )
      expect(mockTx.product.update).not.toHaveBeenCalled()
      expect(mockTx.sale.update).not.toHaveBeenCalled()
    })

    it("throws NotFoundException and restocks nothing for another seller's sale", async () => {
      // The sellerId filter hides the row, so Prisma returns null.
      mockTx.sale.findFirst.mockResolvedValue(null)

      await expect(service.revert(OTHER_SELLER_ID, SALE_ID)).rejects.toThrow(
        NotFoundException
      )
      expect(mockTx.product.update).not.toHaveBeenCalled()
    })

    it('throws ConflictException when the sale is already reverted', async () => {
      mockTx.sale.findFirst.mockResolvedValue(
        makeDbSale({ status: SaleStatus.REVERTED })
      )

      await expect(service.revert(SELLER_ID, SALE_ID)).rejects.toThrow(
        ConflictException
      )
    })

    it('does not restock a second time when the sale is already reverted', async () => {
      mockTx.sale.findFirst.mockResolvedValue(
        makeDbSale({ status: SaleStatus.REVERTED })
      )

      await expect(service.revert(SELLER_ID, SALE_ID)).rejects.toThrow(
        ConflictException
      )
      expect(mockTx.product.update).not.toHaveBeenCalled()
      expect(mockTx.sale.update).not.toHaveBeenCalled()
    })

    it('increments every line back by its exact quantity', async () => {
      mockTx.sale.findFirst.mockResolvedValue(
        makeDbSale({
          items: [
            makeDbSaleItem({ productId: PRODUCT_ID, quantity: 2 }),
            makeDbSaleItem({
              id: 'sale-item-2',
              productId: OTHER_PRODUCT_ID,
              quantity: 7
            })
          ]
        })
      )

      await service.revert(SELLER_ID, SALE_ID)

      expect(mockTx.product.update).toHaveBeenCalledTimes(2)
      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        data: { quantity: { increment: 2 } }
      })
      expect(mockTx.product.update).toHaveBeenCalledWith({
        where: { id: OTHER_PRODUCT_ID },
        data: { quantity: { increment: 7 } }
      })
    })

    it('marks the sale REVERTED and stamps the time it happened', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale())

      await service.revert(SELLER_ID, SALE_ID)

      expect(mockTx.sale.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: SALE_ID },
          data: { status: SaleStatus.REVERTED, revertedAt: expect.any(Date) }
        })
      )
    })

    it('touches no product when the reverted sale has no lines', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale({ items: [] }))

      await service.revert(SELLER_ID, SALE_ID)

      expect(mockTx.product.update).not.toHaveBeenCalled()
      expect(mockTx.sale.update).toHaveBeenCalledTimes(1)
    })

    it('runs the revert inside a single transaction', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale())

      await service.revert(SELLER_ID, SALE_ID)

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1)
    })

    it('propagates a failed restock so the transaction rolls back', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale())
      mockTx.product.update.mockRejectedValue(new Error('db unavailable'))

      await expect(service.revert(SELLER_ID, SALE_ID)).rejects.toThrow(
        'db unavailable'
      )
      expect(mockTx.sale.update).not.toHaveBeenCalled()
    })

    it('serializes the reverted sale to plain numbers', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale())

      const sale = await service.revert(SELLER_ID, SALE_ID)

      expect(typeof sale.totalUsd).toBe('number')
      expect(typeof sale.exchangeRate).toBe('number')
      expect(typeof sale.items[0].unitPrice).toBe('number')
    })

    it('keeps an unset exchange rate as null on the reverted sale', async () => {
      mockTx.sale.findFirst.mockResolvedValue(makeDbSale())
      mockTx.sale.update.mockResolvedValue(
        makeDbSale({
          status: SaleStatus.REVERTED,
          revertedAt: new Date(),
          exchangeRate: null
        })
      )

      const sale = await service.revert(SELLER_ID, SALE_ID)

      expect(sale.exchangeRate).toBeNull()
    })
  })
})
