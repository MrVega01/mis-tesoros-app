import { Test, TestingModule } from '@nestjs/testing'
import { ThrottlerGuard } from '@nestjs/throttler'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserRole, VerificationCodeType } from '@generated/prisma/client'

const mockAuthService = {
  register: jest.fn(),
  verifyEmail: jest.fn(),
  resendCode: jest.fn(),
  login: jest.fn(),
  refresh: jest.fn(),
  logout: jest.fn(),
  forgotPassword: jest.fn(),
  verifyResetCode: jest.fn(),
  resetPassword: jest.fn()
}

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile()

    controller = module.get<AuthController>(AuthController)
  })

  describe('register', () => {
    it('delegates to AuthService.register with correct args', async () => {
      mockAuthService.register.mockResolvedValue({ message: 'ok' })
      await controller.register({ email: 'a@b.com', password: 'pass1234', role: UserRole.SELLER } as any)
      expect(mockAuthService.register).toHaveBeenCalledWith('a@b.com', 'pass1234', UserRole.SELLER)
    })
  })

  describe('verifyEmail', () => {
    it('delegates to AuthService.verifyEmail', async () => {
      mockAuthService.verifyEmail.mockResolvedValue({ accessToken: 'tok' })
      await controller.verifyEmail({ email: 'a@b.com', code: '123456' } as any)
      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith('a@b.com', '123456')
    })
  })

  describe('resendCode', () => {
    it('delegates to AuthService.resendCode', async () => {
      mockAuthService.resendCode.mockResolvedValue({ message: 'sent' })
      await controller.resendCode({
        email: 'a@b.com',
        type: VerificationCodeType.EMAIL_CONFIRMATION
      } as any)
      expect(mockAuthService.resendCode).toHaveBeenCalledWith(
        'a@b.com',
        VerificationCodeType.EMAIL_CONFIRMATION
      )
    })
  })

  describe('login', () => {
    it('delegates to AuthService.login', async () => {
      mockAuthService.login.mockResolvedValue({ accessToken: 'tok' })
      await controller.login({ email: 'a@b.com', password: 'pass1234' } as any)
      expect(mockAuthService.login).toHaveBeenCalledWith('a@b.com', 'pass1234')
    })
  })

  describe('refresh', () => {
    it('delegates to AuthService.refresh', async () => {
      mockAuthService.refresh.mockResolvedValue({ accessToken: 'new' })
      await controller.refresh({ refreshToken: 'old-token' } as any)
      expect(mockAuthService.refresh).toHaveBeenCalledWith('old-token')
    })
  })

  describe('logout', () => {
    it('delegates to AuthService.logout', async () => {
      mockAuthService.logout.mockResolvedValue({ message: 'ok' })
      await controller.logout({ refreshToken: 'token' } as any, { userId: 'uid' })
      expect(mockAuthService.logout).toHaveBeenCalledWith('token')
    })
  })

  describe('forgotPassword', () => {
    it('delegates to AuthService.forgotPassword', async () => {
      mockAuthService.forgotPassword.mockResolvedValue({ message: 'sent' })
      await controller.forgotPassword({ email: 'a@b.com' } as any)
      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('a@b.com')
    })
  })

  describe('verifyResetCode', () => {
    it('delegates to AuthService.verifyResetCode', async () => {
      mockAuthService.verifyResetCode.mockResolvedValue({ resetToken: 'tok' })
      await controller.verifyResetCode({ email: 'a@b.com', code: '123456' } as any)
      expect(mockAuthService.verifyResetCode).toHaveBeenCalledWith('a@b.com', '123456')
    })
  })

  describe('resetPassword', () => {
    it('delegates to AuthService.resetPassword', async () => {
      mockAuthService.resetPassword.mockResolvedValue({ message: 'ok' })
      await controller.resetPassword({ resetToken: 'rtok', password: 'newpass1' } as any)
      expect(mockAuthService.resetPassword).toHaveBeenCalledWith('rtok', 'newpass1')
    })
  })
})
