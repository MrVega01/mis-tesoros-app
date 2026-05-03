import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserRole } from '@prisma/client'

const mockUserService = {
  getMe: jest.fn(),
  updateSellerProfile: jest.fn(),
  updateCustomerProfile: jest.fn()
}

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  describe('getMe', () => {
    it('delegates to UserService.getMe with userId from request', async () => {
      const profile = { id: 'user-id', email: 'test@example.com' }
      mockUserService.getMe.mockResolvedValue(profile)

      const result = await controller.getMe({ userId: 'user-id' })
      expect(mockUserService.getMe).toHaveBeenCalledWith('user-id')
      expect(result).toEqual(profile)
    })
  })

  describe('updateSellerProfile', () => {
    it('delegates to UserService.updateSellerProfile with userId and role', async () => {
      const dto = {
        companyName: 'Acme',
        sellerName: 'John',
        companyType: 'Retail',
        contactNumber: '+1 2025550100'
      }
      mockUserService.updateSellerProfile.mockResolvedValue({ message: 'ok' })

      await controller.updateSellerProfile(
        { userId: 'user-id', role: UserRole.SELLER },
        dto as any
      )
      expect(mockUserService.updateSellerProfile).toHaveBeenCalledWith(
        'user-id',
        UserRole.SELLER,
        dto
      )
    })
  })

  describe('updateCustomerProfile', () => {
    it('delegates to UserService.updateCustomerProfile with userId and role', async () => {
      const dto = {
        firstName: 'Jane',
        lastName: 'Doe',
        contactNumber: '+1 2025550101'
      }
      mockUserService.updateCustomerProfile.mockResolvedValue({ message: 'ok' })

      await controller.updateCustomerProfile(
        { userId: 'user-id', role: UserRole.CUSTOMER },
        dto as any
      )
      expect(mockUserService.updateCustomerProfile).toHaveBeenCalledWith(
        'user-id',
        UserRole.CUSTOMER,
        dto
      )
    })
  })
})
