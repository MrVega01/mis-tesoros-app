import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { PRISMA_ERROR } from '@common/prisma-errors'
import { ProductService } from './product.service'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SELLER_ID = 'seller-1'
const OTHER_SELLER_ID = 'seller-2'
const PRODUCT_ID = 'product-1'
const CATEGORY_ID = 'category-1'

// `price` is a Prisma Decimal in the DB, never a plain number. Anything that
// only stringifies correctly is enough to prove the service coerces it.
function makeDbProduct(overrides: Record<string, any> = {}) {
  return {
    id: PRODUCT_ID,
    sellerId: SELLER_ID,
    name: 'Collar de perlas',
    price: new Prisma.Decimal('12.50'),
    quantity: 3,
    categoryId: CATEGORY_ID,
    archivedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    category: { id: CATEGORY_ID, name: 'Artesanía' },
    ...overrides
  }
}

// The FK violation Postgres raises when a SaleItem still points at the row.
function makeForeignKeyError() {
  return new Prisma.PrismaClientKnownRequestError(
    'Foreign key constraint failed on the field: `sale_items_productId_fkey`',
    { code: PRISMA_ERROR.FOREIGN_KEY_VIOLATION, clientVersion: 'test' }
  )
}

// ─── Mock providers ───────────────────────────────────────────────────────────

const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  category: {
    findFirst: jest.fn()
  },
  saleItem: {
    count: jest.fn()
  }
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('ProductService', () => {
  let service: ProductService

  beforeEach(async () => {
    jest.clearAllMocks()
    // Nothing has been sold unless a test says otherwise.
    mockPrisma.saleItem.count.mockResolvedValue(0)

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile()

    service = module.get<ProductService>(ProductService)
  })

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('scopes the query to the requesting seller and returns newest first', async () => {
      mockPrisma.product.findMany.mockResolvedValue([makeDbProduct()])

      await service.findAll(SELLER_ID)

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { sellerId: SELLER_ID, archivedAt: null },
          orderBy: { createdAt: 'desc' }
        })
      )
    })

    it('returns an empty array when the seller has no products', async () => {
      mockPrisma.product.findMany.mockResolvedValue([])

      await expect(service.findAll(SELLER_ID)).resolves.toEqual([])
    })

    it('serializes every price from a Prisma Decimal to a plain number', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        makeDbProduct({ price: new Prisma.Decimal('12.50') }),
        makeDbProduct({ id: 'product-2', price: new Prisma.Decimal('0') })
      ])

      const result = await service.findAll(SELLER_ID)

      expect(result.every((product) => typeof product.price === 'number')).toBe(
        true
      )
      expect(result.map((product) => product.price)).toEqual([12.5, 0])
    })

    it('does not swallow database errors', async () => {
      mockPrisma.product.findMany.mockRejectedValue(new Error('db unavailable'))

      await expect(service.findAll(SELLER_ID)).rejects.toThrow('db unavailable')
    })
  })

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('scopes the lookup by both id and sellerId', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())

      await service.findOne(SELLER_ID, PRODUCT_ID)

      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: PRODUCT_ID, sellerId: SELLER_ID, archivedAt: null }
        })
      )
    })

    it('throws NotFoundException when the product does not exist', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null)

      await expect(service.findOne(SELLER_ID, 'missing')).rejects.toThrow(
        NotFoundException
      )
    })

    it('throws NotFoundException when the product belongs to another seller', async () => {
      // The sellerId filter makes the row invisible, so Prisma returns null.
      mockPrisma.product.findFirst.mockResolvedValue(null)

      await expect(
        service.findOne(OTHER_SELLER_ID, PRODUCT_ID)
      ).rejects.toThrow(NotFoundException)
      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: PRODUCT_ID, sellerId: OTHER_SELLER_ID, archivedAt: null }
        })
      )
    })

    it('serializes price to a plain number', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(
        makeDbProduct({ price: new Prisma.Decimal('99.99') })
      )

      const result = await service.findOne(SELLER_ID, PRODUCT_ID)

      expect(typeof result.price).toBe('number')
      expect(result.price).toBe(99.99)
    })

    it('keeps the attached category on the response', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())

      const result = await service.findOne(SELLER_ID, PRODUCT_ID)

      expect(result.category).toEqual({ id: CATEGORY_ID, name: 'Artesanía' })
    })
  })

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('persists the product against the requesting seller', async () => {
      mockPrisma.category.findFirst.mockResolvedValue({ id: CATEGORY_ID })
      mockPrisma.product.create.mockResolvedValue(makeDbProduct())

      await service.create(SELLER_ID, {
        name: 'Collar de perlas',
        price: 12.5,
        quantity: 3,
        categoryId: CATEGORY_ID
      })

      expect(mockPrisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            sellerId: SELLER_ID,
            name: 'Collar de perlas',
            price: 12.5,
            quantity: 3,
            categoryId: CATEGORY_ID
          }
        })
      )
    })

    it('defaults quantity to 0 and categoryId to null when omitted', async () => {
      mockPrisma.product.create.mockResolvedValue(
        makeDbProduct({ quantity: 0, categoryId: null, category: null })
      )

      await service.create(SELLER_ID, { name: 'Anillo', price: 5 })

      expect(mockPrisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ quantity: 0, categoryId: null })
        })
      )
    })

    it('keeps an explicit quantity of 0 instead of coercing it away', async () => {
      mockPrisma.product.create.mockResolvedValue(
        makeDbProduct({ quantity: 0 })
      )

      await service.create(SELLER_ID, {
        name: 'Anillo',
        price: 5,
        quantity: 0
      })

      expect(mockPrisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ quantity: 0 })
        })
      )
    })

    it('throws BadRequestException when the category belongs to another seller', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(
        service.create(SELLER_ID, {
          name: 'Anillo',
          price: 5,
          categoryId: 'someone-elses-category'
        })
      ).rejects.toThrow(BadRequestException)
    })

    it('does not create the product when the category check fails', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(
        service.create(SELLER_ID, {
          name: 'Anillo',
          price: 5,
          categoryId: 'someone-elses-category'
        })
      ).rejects.toThrow(BadRequestException)
      expect(mockPrisma.product.create).not.toHaveBeenCalled()
    })

    it('scopes the category ownership lookup by sellerId', async () => {
      mockPrisma.category.findFirst.mockResolvedValue({ id: CATEGORY_ID })
      mockPrisma.product.create.mockResolvedValue(makeDbProduct())

      await service.create(SELLER_ID, {
        name: 'Anillo',
        price: 5,
        categoryId: CATEGORY_ID
      })

      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: CATEGORY_ID, sellerId: SELLER_ID }
        })
      )
    })

    it('skips the category lookup entirely when categoryId is null', async () => {
      mockPrisma.product.create.mockResolvedValue(
        makeDbProduct({ categoryId: null, category: null })
      )

      await service.create(SELLER_ID, {
        name: 'Anillo',
        price: 5,
        categoryId: null
      })

      expect(mockPrisma.category.findFirst).not.toHaveBeenCalled()
    })

    it('skips the category lookup entirely when categoryId is undefined', async () => {
      mockPrisma.product.create.mockResolvedValue(
        makeDbProduct({ categoryId: null, category: null })
      )

      await service.create(SELLER_ID, {
        name: 'Anillo',
        price: 5,
        categoryId: undefined
      })

      expect(mockPrisma.category.findFirst).not.toHaveBeenCalled()
    })

    it('serializes the created price to a plain number', async () => {
      mockPrisma.product.create.mockResolvedValue(
        makeDbProduct({ price: new Prisma.Decimal('7.05') })
      )

      const result = await service.create(SELLER_ID, {
        name: 'Anillo',
        price: 7.05
      })

      expect(typeof result.price).toBe('number')
      expect(result.price).toBe(7.05)
    })
  })

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('checks ownership before mutating', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.product.update.mockResolvedValue(makeDbProduct())

      await service.update(SELLER_ID, PRODUCT_ID, { name: 'Nuevo' })

      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: PRODUCT_ID, sellerId: SELLER_ID, archivedAt: null }
        })
      )
    })

    it('throws NotFoundException and does not update a product owned by another seller', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null)

      await expect(
        service.update(OTHER_SELLER_ID, PRODUCT_ID, { name: 'Hijacked' })
      ).rejects.toThrow(NotFoundException)
      expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })

    it('does not look up a category when the categoryId key is absent', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.product.update.mockResolvedValue(makeDbProduct())

      await service.update(SELLER_ID, PRODUCT_ID, { name: 'Nuevo', price: 1 })

      expect(mockPrisma.category.findFirst).not.toHaveBeenCalled()
    })

    it('accepts categoryId: null as an uncategorize request without a lookup', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.product.update.mockResolvedValue(
        makeDbProduct({ categoryId: null, category: null })
      )

      const result = await service.update(SELLER_ID, PRODUCT_ID, {
        categoryId: null
      })

      expect(mockPrisma.category.findFirst).not.toHaveBeenCalled()
      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: PRODUCT_ID },
          data: { categoryId: null }
        })
      )
      expect(result.categoryId).toBeNull()
    })

    it('validates a provided categoryId against the seller before updating', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.category.findFirst.mockResolvedValue({ id: 'category-2' })
      mockPrisma.product.update.mockResolvedValue(makeDbProduct())

      await service.update(SELLER_ID, PRODUCT_ID, {
        categoryId: 'category-2'
      })

      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'category-2', sellerId: SELLER_ID }
        })
      )
    })

    it('throws BadRequestException and does not update when the category belongs to another seller', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(
        service.update(SELLER_ID, PRODUCT_ID, {
          categoryId: 'someone-elses-category'
        })
      ).rejects.toThrow(BadRequestException)
      expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })

    it('serializes the updated price to a plain number', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.product.update.mockResolvedValue(
        makeDbProduct({ price: new Prisma.Decimal('1000000.01') })
      )

      const result = await service.update(SELLER_ID, PRODUCT_ID, { price: 1 })

      expect(typeof result.price).toBe('number')
      expect(result.price).toBe(1000000.01)
    })

    it('leaves the row untouched when the DTO is empty apart from running the ownership check', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.product.update.mockResolvedValue(makeDbProduct())

      await service.update(SELLER_ID, PRODUCT_ID, {})

      expect(mockPrisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: PRODUCT_ID }, data: {} })
      )
      expect(mockPrisma.category.findFirst).not.toHaveBeenCalled()
    })
  })

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('checks ownership before deleting and confirms the deletion', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.product.delete.mockResolvedValue(makeDbProduct())

      const result = await service.remove(SELLER_ID, PRODUCT_ID)

      expect(mockPrisma.product.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: PRODUCT_ID, sellerId: SELLER_ID, archivedAt: null }
        })
      )
      expect(mockPrisma.product.delete).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID }
      })
      expect(result).toEqual({ message: 'Product deleted' })
    })

    it('throws NotFoundException and never deletes a product owned by another seller', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null)

      await expect(service.remove(OTHER_SELLER_ID, PRODUCT_ID)).rejects.toThrow(
        NotFoundException
      )
      expect(mockPrisma.product.delete).not.toHaveBeenCalled()
    })

    it('really deletes a product that was never sold and never archives it', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.saleItem.count.mockResolvedValue(0)
      mockPrisma.product.delete.mockResolvedValue(makeDbProduct())

      await service.remove(SELLER_ID, PRODUCT_ID)

      expect(mockPrisma.saleItem.count).toHaveBeenCalledWith({
        where: { productId: PRODUCT_ID }
      })
      expect(mockPrisma.product.delete).toHaveBeenCalledTimes(1)
      expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })

    it('archives a product that appears in a sale instead of deleting it', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.saleItem.count.mockResolvedValue(2)
      mockPrisma.product.update.mockResolvedValue(makeDbProduct())

      const result = await service.remove(SELLER_ID, PRODUCT_ID)

      expect(mockPrisma.product.delete).not.toHaveBeenCalled()
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        data: { archivedAt: expect.any(Date) }
      })
      // The caller cannot tell archiving from deletion — the product is gone
      // from every read either way.
      expect(result).toEqual({ message: 'Product deleted' })
    })

    it('does not count sale lines for a product owned by another seller', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(null)

      await expect(service.remove(OTHER_SELLER_ID, PRODUCT_ID)).rejects.toThrow(
        NotFoundException
      )
      expect(mockPrisma.saleItem.count).not.toHaveBeenCalled()
      expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })

    it('falls back to archiving when a sale lands between the count and the delete', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.saleItem.count.mockResolvedValue(0)
      mockPrisma.product.delete.mockRejectedValue(makeForeignKeyError())
      mockPrisma.product.update.mockResolvedValue(makeDbProduct())

      const result = await service.remove(SELLER_ID, PRODUCT_ID)

      expect(mockPrisma.product.delete).toHaveBeenCalledTimes(1)
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: PRODUCT_ID },
        data: { archivedAt: expect.any(Date) }
      })
      expect(result).toEqual({ message: 'Product deleted' })
    })

    it('does not swallow database errors raised by the delete', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.saleItem.count.mockResolvedValue(0)
      mockPrisma.product.delete.mockRejectedValue(new Error('db unavailable'))

      await expect(service.remove(SELLER_ID, PRODUCT_ID)).rejects.toThrow(
        'db unavailable'
      )
      // A non-FK failure is a real failure: nothing gets archived behind it.
      expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })

    it('propagates a Prisma error whose code is not a foreign-key violation', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.saleItem.count.mockResolvedValue(0)
      mockPrisma.product.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: PRISMA_ERROR.RECORD_NOT_FOUND,
          clientVersion: 'test'
        })
      )

      await expect(service.remove(SELLER_ID, PRODUCT_ID)).rejects.toThrow(
        Prisma.PrismaClientKnownRequestError
      )
      expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })

    it('does not swallow a failure of the archive write itself', async () => {
      mockPrisma.product.findFirst.mockResolvedValue(makeDbProduct())
      mockPrisma.saleItem.count.mockResolvedValue(1)
      mockPrisma.product.update.mockRejectedValue(new Error('db unavailable'))

      await expect(service.remove(SELLER_ID, PRODUCT_ID)).rejects.toThrow(
        'db unavailable'
      )
    })
  })
})
