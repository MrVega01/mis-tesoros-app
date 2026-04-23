import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { UserService } from './user.service'
import { PrismaService } from '@core/prisma/prisma.service'
import { RedisService } from '@core/redis/redis.service'
import { UserRole } from '@generated/prisma/client'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeDbUser (overrides: Record<string, any> = {}) {
  return {
    id: 'user-id',
    email: 'test@example.com',
    role: UserRole.SELLER,
    emailVerified: true,
    sellerProfile: null,
    customerProfile: null,
    ...overrides
  }
}

const sellerProfileDto = {
  companyName: 'Acme',
  sellerName: 'John',
  companyType: 'Retail',
  contactNumber: '+1 2025550100'
}

const customerProfileDto = {
  firstName: 'Jane',
  lastName: 'Doe',
  contactNumber: '+1 2025550101'
}

// ─── Mock providers ───────────────────────────────────────────────────────────

const mockPrisma = {
  user: { findUnique: jest.fn() },
  sellerProfile: { upsert: jest.fn(), findUnique: jest.fn() },
  customerProfile: { upsert: jest.fn(), findUnique: jest.fn() }
}

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn()
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  // ─── getMe ─────────────────────────────────────────────────────────────────

  describe('getMe', () => {
    it('returns cached result when Redis has data', async () => {
      const cached = { id: 'user-id', email: 'test@example.com', role: UserRole.SELLER }
      mockRedis.get.mockResolvedValue(JSON.stringify(cached))

      const result = await service.getMe('user-id')
      expect(result).toEqual(cached)
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('throws NotFoundException when user does not exist in DB', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.user.findUnique.mockResolvedValue(null)

      await expect(service.getMe('nonexistent')).rejects.toThrow(NotFoundException)
    })

    it('fetches from DB and caches for 5 minutes', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.user.findUnique.mockResolvedValue(makeDbUser())
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.getMe('user-id')
      expect(result.id).toBe('user-id')
      expect(mockRedis.set).toHaveBeenCalledWith(
        'user:user-id',
        expect.any(String),
        300
      )
    })

    it('sets hasProfile: true when seller profile exists', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.user.findUnique.mockResolvedValue(
        makeDbUser({ sellerProfile: { id: 'sp-1', companyName: 'Acme' } })
      )
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.getMe('user-id')
      expect(result.hasProfile).toBe(true)
    })

    it('sets hasProfile: false when seller profile does not exist', async () => {
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.user.findUnique.mockResolvedValue(makeDbUser({ sellerProfile: null }))
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.getMe('user-id')
      expect(result.hasProfile).toBe(false)
    })

    it('returns customer profile for CUSTOMER role', async () => {
      mockRedis.get.mockResolvedValue(null)
      const customerProfile = { id: 'cp-1', firstName: 'Jane' }
      mockPrisma.user.findUnique.mockResolvedValue(
        makeDbUser({ role: UserRole.CUSTOMER, customerProfile })
      )
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.getMe('user-id')
      expect(result.profile).toEqual(customerProfile)
      expect(result.hasProfile).toBe(true)
    })
  })

  // ─── updateSellerProfile ───────────────────────────────────────────────────

  describe('updateSellerProfile', () => {
    it('throws ForbiddenException when role is CUSTOMER', async () => {
      await expect(
        service.updateSellerProfile('user-id', UserRole.CUSTOMER, sellerProfileDto as any)
      ).rejects.toThrow(ForbiddenException)
    })

    it('upserts seller profile for SELLER role', async () => {
      mockPrisma.sellerProfile.upsert.mockResolvedValue({ id: 'sp-1', ...sellerProfileDto })
      mockRedis.del.mockResolvedValue(1)

      const result: any = await service.updateSellerProfile('user-id', UserRole.SELLER, sellerProfileDto as any)
      expect(mockPrisma.sellerProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-id' },
          create: expect.objectContaining({ userId: 'user-id' }),
          update: expect.objectContaining(sellerProfileDto)
        })
      )
      expect(result.message).toBe('Seller profile updated')
    })

    it('invalidates Redis cache after upsert', async () => {
      mockPrisma.sellerProfile.upsert.mockResolvedValue({ id: 'sp-1' })
      mockRedis.del.mockResolvedValue(1)

      await service.updateSellerProfile('user-id', UserRole.SELLER, sellerProfileDto as any)
      expect(mockRedis.del).toHaveBeenCalledWith('user:user-id')
    })
  })

  // ─── updateCustomerProfile ─────────────────────────────────────────────────

  describe('updateCustomerProfile', () => {
    it('throws ForbiddenException when role is SELLER', async () => {
      await expect(
        service.updateCustomerProfile('user-id', UserRole.SELLER, customerProfileDto as any)
      ).rejects.toThrow(ForbiddenException)
    })

    it('upserts customer profile for CUSTOMER role', async () => {
      mockPrisma.customerProfile.upsert.mockResolvedValue({ id: 'cp-1', ...customerProfileDto })
      mockRedis.del.mockResolvedValue(1)

      const result: any = await service.updateCustomerProfile('user-id', UserRole.CUSTOMER, customerProfileDto as any)
      expect(mockPrisma.customerProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-id' }
        })
      )
      expect(result.message).toBe('Customer profile updated')
    })

    it('invalidates Redis cache after upsert', async () => {
      mockPrisma.customerProfile.upsert.mockResolvedValue({ id: 'cp-1' })
      mockRedis.del.mockResolvedValue(1)

      await service.updateCustomerProfile('user-id', UserRole.CUSTOMER, customerProfileDto as any)
      expect(mockRedis.del).toHaveBeenCalledWith('user:user-id')
    })
  })
})
