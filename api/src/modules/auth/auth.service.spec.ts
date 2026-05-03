import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'

jest.mock('bcrypt')
import { PrismaService } from '@core/prisma/prisma.service'
import { RedisService } from '@core/redis/redis.service'
import { MailService } from '@core/mail/mail.service'
import { UserRole, VerificationCodeType } from '@prisma/client'

// ─── Shared mock factories ────────────────────────────────────────────────────

function makeUser(overrides: Record<string, any> = {}) {
  return {
    id: 'user-id',
    email: 'test@example.com',
    passwordHash: 'hashed',
    role: UserRole.SELLER,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}

function makeCode(overrides: Record<string, any> = {}) {
  return {
    id: 'code-id',
    code: '123456',
    type: VerificationCodeType.EMAIL_CONFIRMATION,
    used: false,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    userId: 'user-id',
    createdAt: new Date(),
    ...overrides
  }
}

function makeRefreshToken(overrides: Record<string, any> = {}) {
  return {
    id: 'token-id',
    token: 'refresh-jwt',
    userId: 'user-id',
    revoked: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    ...overrides
  }
}

// ─── Mock providers ───────────────────────────────────────────────────────────

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn()
  },
  sellerProfile: { findUnique: jest.fn() },
  customerProfile: { findUnique: jest.fn() },
  verificationCode: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn()
  },
  refreshToken: {
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn()
  }
}

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn()
}

const mockMail = {
  sendVerificationCode: jest.fn(),
  sendPasswordResetCode: jest.fn()
}

const mockJwt = {
  sign: jest.fn().mockReturnValue('signed-token'),
  verify: jest.fn()
}

const mockConfig = {
  get: jest.fn((key: string, defaultVal?: any) => {
    const map: Record<string, any> = {
      VERIFICATION_CODE_EXPIRY_MINUTES: 15,
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_EXPIRATION: '7d'
    }
    return map[key] ?? defaultVal
  })
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
        { provide: MailService, useValue: mockMail },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  // ─── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('throws ConflictException when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      await expect(
        service.register('test@example.com', 'password123', UserRole.SELLER)
      ).rejects.toThrow(ConflictException)
    })

    describe('SELLER role', () => {
      beforeEach(() => {
        // First call: email-exists check → null; second call: createAndSendCode id-lookup → user
        mockPrisma.user.findUnique
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(makeUser())
        mockPrisma.user.create.mockResolvedValue(makeUser())
        mockPrisma.verificationCode.updateMany.mockResolvedValue({ count: 0 })
        mockPrisma.verificationCode.create.mockResolvedValue(makeCode())
        jest.mocked(bcrypt.hash).mockResolvedValue('hashed' as never)
      })

      it('creates user with emailVerified: false', async () => {
        await service.register(
          'test@example.com',
          'password123',
          UserRole.SELLER
        )
        expect(mockPrisma.user.create).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ emailVerified: false })
          })
        )
      })

      it('sends verification code email', async () => {
        await service.register(
          'test@example.com',
          'password123',
          UserRole.SELLER
        )
        expect(mockMail.sendVerificationCode).toHaveBeenCalledWith(
          'test@example.com',
          expect.any(String)
        )
      })

      it('returns userId, email, role without tokens', async () => {
        const result = await service.register(
          'test@example.com',
          'password123',
          UserRole.SELLER
        )
        expect(result).toMatchObject({
          message: expect.stringContaining('verify your email'),
          userId: 'user-id',
          email: 'test@example.com',
          role: UserRole.SELLER
        })
        expect(result).not.toHaveProperty('accessToken')
      })
    })

    describe('CUSTOMER role', () => {
      beforeEach(() => {
        const customerUser = makeUser({ role: UserRole.CUSTOMER })
        mockPrisma.user.findUnique.mockResolvedValue(null)
        mockPrisma.user.create.mockResolvedValue(customerUser)
        mockPrisma.customerProfile.findUnique.mockResolvedValue(null)
        mockPrisma.refreshToken.create.mockResolvedValue(makeRefreshToken())
        mockPrisma.refreshToken.update.mockResolvedValue(makeRefreshToken())
        mockRedis.set.mockResolvedValue('OK')
        jest.mocked(bcrypt.hash).mockResolvedValue('hashed' as never)
      })

      it('does not send verification email', async () => {
        await service.register(
          'test@example.com',
          'password123',
          UserRole.CUSTOMER
        )
        expect(mockMail.sendVerificationCode).not.toHaveBeenCalled()
      })

      it('returns access and refresh tokens immediately', async () => {
        const result = await service.register(
          'test@example.com',
          'password123',
          UserRole.CUSTOMER
        )
        expect(result).toHaveProperty('accessToken')
        expect(result).toHaveProperty('refreshToken')
      })

      it('returns emailVerified: false in user payload', async () => {
        const result: any = await service.register(
          'test@example.com',
          'password123',
          UserRole.CUSTOMER
        )
        expect(result.user.emailVerified).toBe(false)
      })
    })
  })

  // ─── verifyEmail ───────────────────────────────────────────────────────────

  describe('verifyEmail', () => {
    it('throws NotFoundException when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      await expect(
        service.verifyEmail('test@example.com', '123456')
      ).rejects.toThrow(NotFoundException)
    })

    it('throws BadRequestException when email already verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(
        makeUser({ emailVerified: true })
      )
      await expect(
        service.verifyEmail('test@example.com', '123456')
      ).rejects.toThrow(BadRequestException)
    })

    it('throws BadRequestException when no active code found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(null)
      await expect(
        service.verifyEmail('test@example.com', '123456')
      ).rejects.toThrow(BadRequestException)
    })

    it('throws BadRequestException when code is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(
        makeCode({ code: '999999' })
      )
      await expect(
        service.verifyEmail('test@example.com', '123456')
      ).rejects.toThrow(BadRequestException)
    })

    it('throws BadRequestException when code is expired', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(
        makeCode({ expiresAt: new Date(Date.now() - 1000) })
      )
      await expect(
        service.verifyEmail('test@example.com', '123456')
      ).rejects.toThrow(BadRequestException)
    })

    it('marks code as used and user emailVerified on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(makeCode())
      mockPrisma.verificationCode.update.mockResolvedValue({})
      mockPrisma.user.update.mockResolvedValue(
        makeUser({ emailVerified: true })
      )
      mockPrisma.sellerProfile.findUnique.mockResolvedValue(null)
      mockPrisma.refreshToken.create.mockResolvedValue(makeRefreshToken())
      mockPrisma.refreshToken.update.mockResolvedValue(makeRefreshToken())
      mockRedis.set.mockResolvedValue('OK')

      await service.verifyEmail('test@example.com', '123456')

      expect(mockPrisma.verificationCode.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { used: true } })
      )
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { emailVerified: true } })
      )
    })

    it('returns tokens with emailVerified: true on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(makeCode())
      mockPrisma.verificationCode.update.mockResolvedValue({})
      mockPrisma.user.update.mockResolvedValue(
        makeUser({ emailVerified: true })
      )
      mockPrisma.sellerProfile.findUnique.mockResolvedValue(null)
      mockPrisma.refreshToken.create.mockResolvedValue(makeRefreshToken())
      mockPrisma.refreshToken.update.mockResolvedValue(makeRefreshToken())
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.verifyEmail(
        'test@example.com',
        '123456'
      )
      expect(result).toHaveProperty('accessToken')
      expect(result.user.emailVerified).toBe(true)
    })
  })

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('throws UnauthorizedException when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      await expect(
        service.login('test@example.com', 'password')
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never)
      await expect(service.login('test@example.com', 'wrong')).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('throws ForbiddenException when seller has not verified email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(
        makeUser({ role: UserRole.SELLER, emailVerified: false })
      )
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never)
      await expect(
        service.login('test@example.com', 'password123')
      ).rejects.toThrow(ForbiddenException)
    })

    it('returns tokens for verified seller', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(
        makeUser({ emailVerified: true })
      )
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never)
      mockPrisma.sellerProfile.findUnique.mockResolvedValue(null)
      mockPrisma.refreshToken.create.mockResolvedValue(makeRefreshToken())
      mockPrisma.refreshToken.update.mockResolvedValue(makeRefreshToken())
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.login('test@example.com', 'password123')
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('returns tokens for customer even when email is not verified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(
        makeUser({ role: UserRole.CUSTOMER, emailVerified: false })
      )
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never)
      mockPrisma.customerProfile.findUnique.mockResolvedValue(null)
      mockPrisma.refreshToken.create.mockResolvedValue(makeRefreshToken())
      mockPrisma.refreshToken.update.mockResolvedValue(makeRefreshToken())
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.login('test@example.com', 'password123')
      expect(result).toHaveProperty('accessToken')
    })
  })

  // ─── refresh ───────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('throws UnauthorizedException when token signature is invalid', async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error('invalid')
      })
      await expect(service.refresh('bad-token')).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('throws UnauthorizedException when token is revoked (Redis hit)', async () => {
      mockJwt.verify.mockReturnValue({ sub: 'user-id', jti: 'token-id' })
      mockRedis.get.mockResolvedValue(
        JSON.stringify({ userId: 'user-id', revoked: true })
      )
      await expect(service.refresh('valid-token')).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('throws UnauthorizedException when token is revoked (DB fallback)', async () => {
      mockJwt.verify.mockReturnValue({ sub: 'user-id', jti: 'token-id' })
      mockRedis.get.mockResolvedValue(null)
      mockPrisma.refreshToken.findUnique.mockResolvedValue(
        makeRefreshToken({ revoked: true })
      )
      await expect(service.refresh('valid-token')).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('rotates token and returns new pair on success', async () => {
      mockJwt.verify.mockReturnValue({ sub: 'user-id', jti: 'token-id' })
      mockRedis.get.mockResolvedValue(
        JSON.stringify({ userId: 'user-id', revoked: false })
      )
      mockPrisma.refreshToken.update.mockResolvedValue({})
      mockRedis.del.mockResolvedValue(1)
      mockPrisma.user.findUnique.mockResolvedValue(
        makeUser({ emailVerified: true })
      )
      mockPrisma.refreshToken.create.mockResolvedValue(makeRefreshToken())
      mockRedis.set.mockResolvedValue('OK')

      const result: any = await service.refresh('valid-token')
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revoked: true } })
      )
    })
  })

  // ─── forgotPassword ────────────────────────────────────────────────────────

  describe('forgotPassword', () => {
    it('returns the same message whether email exists or not', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      const result = await service.forgotPassword('nonexistent@example.com')
      expect(result.message).toContain('If an account')
      expect(mockMail.sendPasswordResetCode).not.toHaveBeenCalled()
    })

    it('sends reset code when user exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.updateMany.mockResolvedValue({ count: 0 })
      mockPrisma.verificationCode.create.mockResolvedValue(
        makeCode({ type: VerificationCodeType.PASSWORD_RESET })
      )

      await service.forgotPassword('test@example.com')
      expect(mockMail.sendPasswordResetCode).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String)
      )
    })
  })

  // ─── verifyResetCode ───────────────────────────────────────────────────────

  describe('verifyResetCode', () => {
    it('throws BadRequestException when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      await expect(
        service.verifyResetCode('test@example.com', '123456')
      ).rejects.toThrow(BadRequestException)
    })

    it('throws BadRequestException when code is invalid or expired', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(null)
      await expect(
        service.verifyResetCode('test@example.com', '123456')
      ).rejects.toThrow(BadRequestException)
    })

    it('returns a resetToken on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.findFirst.mockResolvedValue(
        makeCode({ type: VerificationCodeType.PASSWORD_RESET })
      )
      mockPrisma.verificationCode.update.mockResolvedValue({})

      const result: any = await service.verifyResetCode(
        'test@example.com',
        '123456'
      )
      expect(result).toHaveProperty('resetToken')
      expect(result.message).toBe('Code verified')
    })
  })

  // ─── resetPassword ─────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('throws UnauthorizedException when resetToken is invalid', async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error('invalid')
      })
      await expect(
        service.resetPassword('bad-token', 'newpass123')
      ).rejects.toThrow(UnauthorizedException)
    })

    it('throws UnauthorizedException when token purpose is wrong', async () => {
      mockJwt.verify.mockReturnValue({
        sub: 'user-id',
        purpose: 'something-else'
      })
      await expect(
        service.resetPassword('bad-purpose-token', 'newpass123')
      ).rejects.toThrow(UnauthorizedException)
    })

    it('updates password hash and revokes all refresh tokens', async () => {
      mockJwt.verify.mockReturnValue({
        sub: 'user-id',
        purpose: 'password-reset'
      })
      jest.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never)
      mockPrisma.user.update.mockResolvedValue({})
      mockPrisma.refreshToken.findMany.mockResolvedValue([makeRefreshToken()])
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 })
      mockRedis.del.mockResolvedValue(1)

      await service.resetPassword('valid-reset-token', 'newpass123')

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { passwordHash: 'new-hash' } })
      )
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revoked: true } })
      )
    })
  })

  // ─── resendCode ────────────────────────────────────────────────────────────

  describe('resendCode', () => {
    it('throws NotFoundException when user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      await expect(
        service.resendCode(
          'test@example.com',
          VerificationCodeType.EMAIL_CONFIRMATION
        )
      ).rejects.toThrow(NotFoundException)
    })

    it('invalidates old codes and sends a new one', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(makeUser())
      mockPrisma.verificationCode.updateMany.mockResolvedValue({ count: 1 })
      mockPrisma.verificationCode.create.mockResolvedValue(makeCode())

      await service.resendCode(
        'test@example.com',
        VerificationCodeType.EMAIL_CONFIRMATION
      )

      expect(mockPrisma.verificationCode.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { used: true } })
      )
      expect(mockMail.sendVerificationCode).toHaveBeenCalled()
    })
  })

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('revokes the refresh token and removes from Redis', async () => {
      mockJwt.verify.mockReturnValue({ jti: 'token-id' })
      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 1 })
      mockRedis.del.mockResolvedValue(1)

      const result = await service.logout('valid-refresh-token')
      expect(result.message).toBe('Logged out successfully')
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { revoked: true } })
      )
      expect(mockRedis.del).toHaveBeenCalledWith('refresh:token-id')
    })

    it('still returns success even when token is already expired', async () => {
      mockJwt.verify.mockImplementation(() => {
        throw new Error('expired')
      })
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null)

      const result = await service.logout('expired-token')
      expect(result.message).toBe('Logged out successfully')
    })
  })
})
