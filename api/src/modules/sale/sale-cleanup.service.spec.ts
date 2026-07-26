import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { SaleCleanupService } from './sale-cleanup.service'

// ─── Mock providers ───────────────────────────────────────────────────────────

const mockPrisma = {
  sale: {
    deleteMany: jest.fn()
  },
  product: {
    deleteMany: jest.fn()
  }
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('SaleCleanupService', () => {
  let service: SaleCleanupService
  let logSpy: jest.SpyInstance

  beforeEach(async () => {
    jest.clearAllMocks()

    mockPrisma.sale.deleteMany.mockResolvedValue({ count: 0 })
    mockPrisma.product.deleteMany.mockResolvedValue({ count: 0 })

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleCleanupService,
        { provide: PrismaService, useValue: mockPrisma }
      ]
    }).compile()

    service = module.get<SaleCleanupService>(SaleCleanupService)

    // Spied after bootstrap so Nest's own startup logging is not counted.
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  // ─── removeOrphanedRecords ───────────────────────────────────────────────────

  describe('removeOrphanedRecords', () => {
    it('deletes only the sales whose seller and customer are both gone', async () => {
      await service.removeOrphanedRecords()

      expect(mockPrisma.sale.deleteMany).toHaveBeenCalledTimes(1)
      expect(mockPrisma.sale.deleteMany).toHaveBeenCalledWith({
        where: { sellerId: null, customerId: null }
      })
    })

    it('deletes only the detached products that no sale line points at', async () => {
      await service.removeOrphanedRecords()

      expect(mockPrisma.product.deleteMany).toHaveBeenCalledTimes(1)
      expect(mockPrisma.product.deleteMany).toHaveBeenCalledWith({
        where: { sellerId: null, saleItems: { none: {} } }
      })
    })

    it('deletes the sales before the products so cascaded lines free them up', async () => {
      const order: string[] = []
      mockPrisma.sale.deleteMany.mockImplementation(() => {
        order.push('sale')
        return Promise.resolve({ count: 1 })
      })
      mockPrisma.product.deleteMany.mockImplementation(() => {
        order.push('product')
        return Promise.resolve({ count: 1 })
      })

      await service.removeOrphanedRecords()

      expect(order).toEqual(['sale', 'product'])
    })

    it('returns both counts', async () => {
      mockPrisma.sale.deleteMany.mockResolvedValue({ count: 3 })
      mockPrisma.product.deleteMany.mockResolvedValue({ count: 5 })

      await expect(service.removeOrphanedRecords()).resolves.toEqual({
        sales: 3,
        products: 5
      })
    })

    it('returns zeroes and does not crash when there is nothing to reap', async () => {
      await expect(service.removeOrphanedRecords()).resolves.toEqual({
        sales: 0,
        products: 0
      })
    })

    it('stays quiet when nothing was removed', async () => {
      await service.removeOrphanedRecords()

      expect(logSpy).not.toHaveBeenCalled()
    })

    it('logs once when only orphaned sales were removed', async () => {
      mockPrisma.sale.deleteMany.mockResolvedValue({ count: 2 })

      await service.removeOrphanedRecords()

      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Removed 2 orphaned sale(s)')
      )
    })

    it('logs once when only orphaned products were removed', async () => {
      mockPrisma.product.deleteMany.mockResolvedValue({ count: 4 })

      await service.removeOrphanedRecords()

      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('4 orphaned product(s)')
      )
    })

    it('does not swallow a failure while deleting sales, and never reaches the products', async () => {
      mockPrisma.sale.deleteMany.mockRejectedValue(new Error('db unavailable'))

      await expect(service.removeOrphanedRecords()).rejects.toThrow(
        'db unavailable'
      )
      expect(mockPrisma.product.deleteMany).not.toHaveBeenCalled()
    })

    it('does not swallow a failure while deleting products', async () => {
      mockPrisma.product.deleteMany.mockRejectedValue(
        new Error('db unavailable')
      )

      await expect(service.removeOrphanedRecords()).rejects.toThrow(
        'db unavailable'
      )
    })
  })
})
