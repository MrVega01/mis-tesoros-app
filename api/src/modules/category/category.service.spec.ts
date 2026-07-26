import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CategoryService } from './category.service'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SELLER_ID = 'seller-1'
const OTHER_SELLER_ID = 'seller-2'
const CATEGORY_ID = 'category-1'

function makeDbCategory(overrides: Record<string, any> = {}) {
  return {
    id: CATEGORY_ID,
    sellerId: SELLER_ID,
    name: 'Artesanía',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides
  }
}

function makeUniqueViolation() {
  return new Prisma.PrismaClientKnownRequestError(
    'Unique constraint failed on the fields: (`sellerId`,`name`)',
    { code: 'P2002', clientVersion: 'test' }
  )
}

// ─── Mock providers ───────────────────────────────────────────────────────────

const mockPrisma = {
  category: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('CategoryService', () => {
  let service: CategoryService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile()

    service = module.get<CategoryService>(CategoryService)
  })

  // ─── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('scopes the query to the requesting seller and sorts by name', async () => {
      mockPrisma.category.findMany.mockResolvedValue([makeDbCategory()])

      await service.findAll(SELLER_ID)

      expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
        where: { sellerId: SELLER_ID },
        orderBy: { name: 'asc' }
      })
    })

    it('returns an empty array when the seller has no categories', async () => {
      mockPrisma.category.findMany.mockResolvedValue([])

      await expect(service.findAll(SELLER_ID)).resolves.toEqual([])
    })

    it('does not swallow database errors', async () => {
      mockPrisma.category.findMany.mockRejectedValue(
        new Error('db unavailable')
      )

      await expect(service.findAll(SELLER_ID)).rejects.toThrow('db unavailable')
    })
  })

  // ─── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('scopes the lookup by both id and sellerId', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())

      await service.findOne(SELLER_ID, CATEGORY_ID)

      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID, sellerId: SELLER_ID }
      })
    })

    it('throws NotFoundException when the category does not exist', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(service.findOne(SELLER_ID, 'missing')).rejects.toThrow(
        NotFoundException
      )
    })

    it('throws NotFoundException when the category belongs to another seller', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(
        service.findOne(OTHER_SELLER_ID, CATEGORY_ID)
      ).rejects.toThrow(NotFoundException)
      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID, sellerId: OTHER_SELLER_ID }
      })
    })
  })

  // ─── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('persists the category against the requesting seller', async () => {
      mockPrisma.category.create.mockResolvedValue(makeDbCategory())

      const result = await service.create(SELLER_ID, { name: 'Artesanía' })

      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: { sellerId: SELLER_ID, name: 'Artesanía' }
      })
      expect(result).toEqual(makeDbCategory())
    })

    it('ignores any sellerId smuggled in through the DTO', async () => {
      mockPrisma.category.create.mockResolvedValue(makeDbCategory())

      await service.create(SELLER_ID, {
        name: 'Artesanía',
        sellerId: OTHER_SELLER_ID
      } as any)

      expect(mockPrisma.category.create).toHaveBeenCalledWith({
        data: { sellerId: SELLER_ID, name: 'Artesanía' }
      })
    })

    it('translates a P2002 unique violation into ConflictException', async () => {
      mockPrisma.category.create.mockRejectedValue(makeUniqueViolation())

      await expect(
        service.create(SELLER_ID, { name: 'Artesanía' })
      ).rejects.toThrow(ConflictException)
      await expect(
        service.create(SELLER_ID, { name: 'Artesanía' })
      ).rejects.toThrow('You already have a category with that name')
    })

    it('rethrows other Prisma known request errors untouched', async () => {
      const error = new Prisma.PrismaClientKnownRequestError('fk violation', {
        code: 'P2003',
        clientVersion: 'test'
      })
      mockPrisma.category.create.mockRejectedValue(error)

      await expect(
        service.create(SELLER_ID, { name: 'Artesanía' })
      ).rejects.toBe(error)
    })

    it('rethrows non-Prisma errors untouched', async () => {
      const error = new Error('db unavailable')
      mockPrisma.category.create.mockRejectedValue(error)

      await expect(
        service.create(SELLER_ID, { name: 'Artesanía' })
      ).rejects.toBe(error)
    })
  })

  // ─── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('checks ownership before mutating', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())
      mockPrisma.category.update.mockResolvedValue(
        makeDbCategory({ name: 'Joyería' })
      )

      await service.update(SELLER_ID, CATEGORY_ID, { name: 'Joyería' })

      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID, sellerId: SELLER_ID }
      })
      expect(mockPrisma.category.update).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID },
        data: { name: 'Joyería' }
      })
    })

    it('throws NotFoundException and does not update a category owned by another seller', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(
        service.update(OTHER_SELLER_ID, CATEGORY_ID, { name: 'Hijacked' })
      ).rejects.toThrow(NotFoundException)
      expect(mockPrisma.category.update).not.toHaveBeenCalled()
    })

    it('translates a P2002 unique violation into ConflictException', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())
      mockPrisma.category.update.mockRejectedValue(makeUniqueViolation())

      await expect(
        service.update(SELLER_ID, CATEGORY_ID, { name: 'Duplicada' })
      ).rejects.toThrow(ConflictException)
    })

    it('rethrows other errors untouched', async () => {
      const error = new Error('db unavailable')
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())
      mockPrisma.category.update.mockRejectedValue(error)

      await expect(
        service.update(SELLER_ID, CATEGORY_ID, { name: 'Joyería' })
      ).rejects.toBe(error)
    })

    it('still runs the ownership check for an empty DTO', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())
      mockPrisma.category.update.mockResolvedValue(makeDbCategory())

      await service.update(SELLER_ID, CATEGORY_ID, {})

      expect(mockPrisma.category.findFirst).toHaveBeenCalledTimes(1)
      expect(mockPrisma.category.update).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID },
        data: {}
      })
    })
  })

  // ─── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('checks ownership before deleting and confirms the deletion', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())
      mockPrisma.category.delete.mockResolvedValue(makeDbCategory())

      const result = await service.remove(SELLER_ID, CATEGORY_ID)

      expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID, sellerId: SELLER_ID }
      })
      expect(mockPrisma.category.delete).toHaveBeenCalledWith({
        where: { id: CATEGORY_ID }
      })
      expect(result).toEqual({ message: 'Category deleted' })
    })

    it('throws NotFoundException and never deletes a category owned by another seller', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(null)

      await expect(
        service.remove(OTHER_SELLER_ID, CATEGORY_ID)
      ).rejects.toThrow(NotFoundException)
      expect(mockPrisma.category.delete).not.toHaveBeenCalled()
    })

    it('does not swallow database errors raised by the delete', async () => {
      mockPrisma.category.findFirst.mockResolvedValue(makeDbCategory())
      mockPrisma.category.delete.mockRejectedValue(new Error('db unavailable'))

      await expect(service.remove(SELLER_ID, CATEGORY_ID)).rejects.toThrow(
        'db unavailable'
      )
    })
  })
})
