import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '@core/prisma/prisma.service'
import { RefreshTokenCleanupService } from './refresh-token-cleanup.service'

// ─── Mock providers ───────────────────────────────────────────────────────────

const mockPrisma = {
  refreshToken: {
    deleteMany: jest.fn()
  }
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('RefreshTokenCleanupService', () => {
  let service: RefreshTokenCleanupService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenCleanupService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile()

    service = module.get<RefreshTokenCleanupService>(RefreshTokenCleanupService)
  })

  // ─── removeExpiredTokens ─────────────────────────────────────────────────────

  describe('removeExpiredTokens', () => {
    it('deletes expired tokens with the correct predicate and returns the count', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 3 })

      const result = await service.removeExpiredTokens()

      expect(result).toBe(3)
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledTimes(1)
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { expiresAt: { lt: expect.any(Date) } }
      })
    })

    it('returns 0 and does not crash when nothing has expired', async () => {
      mockPrisma.refreshToken.deleteMany.mockResolvedValue({ count: 0 })

      const result = await service.removeExpiredTokens()

      expect(result).toBe(0)
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledTimes(1)
    })

    it('does not swallow database errors', async () => {
      mockPrisma.refreshToken.deleteMany.mockRejectedValue(
        new Error('db unavailable')
      )

      await expect(service.removeExpiredTokens()).rejects.toThrow(
        'db unavailable'
      )
    })
  })
})
