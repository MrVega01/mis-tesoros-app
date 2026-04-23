import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '@core/prisma/prisma.service'
import { RedisService } from '@core/redis/redis.service'
import { MailService } from '@core/mail/mail.service'
import { UserRole, VerificationCodeType } from '@generated/prisma/client'

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private redis: RedisService,
    private mail: MailService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  // ─── Helpers ──────────────────────────────────────────

  private generateCode (): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  private codeExpiryMinutes (): number {
    return this.config.get<number>('VERIFICATION_CODE_EXPIRY_MINUTES', 15)
  }

  private issueAccessToken (userId: string, email: string, role: UserRole): string {
    return this.jwt.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION', '15m') as any
      }
    )
  }

  private issueResetToken (userId: string): string {
    return this.jwt.sign(
      { sub: userId, purpose: 'password-reset' },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '10m' as any
      }
    )
  }

  private async issueRefreshToken (userId: string): Promise<string> {
    const expiresIn = this.config.get('JWT_REFRESH_EXPIRATION', '7d') as any
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const record = await this.prisma.refreshToken.create({
      data: { userId, token: '', expiresAt }
    })

    const token = this.jwt.sign(
      { sub: userId, jti: record.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn
      }
    )

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { token }
    })

    await this.redis.set(`refresh:${record.id}`, JSON.stringify({ userId, revoked: false }), 60 * 60 * 24 * 7)

    return token
  }

  private async buildTokenResponse (userId: string, email: string, role: UserRole) {
    const accessToken = this.issueAccessToken(userId, email, role)
    const refreshToken = await this.issueRefreshToken(userId)

    const hasProfile = role === UserRole.SELLER
      ? !!(await this.prisma.sellerProfile.findUnique({ where: { userId } }))
      : !!(await this.prisma.customerProfile.findUnique({ where: { userId } }))

    return { accessToken, refreshToken, user: { id: userId, email, role, hasProfile } }
  }

  private async createAndSendCode (userId: string, type: VerificationCodeType): Promise<void> {
    // Invalidate existing unused codes of same type
    await this.prisma.verificationCode.updateMany({
      where: { userId, type, used: false },
      data: { used: true }
    })

    const code = this.generateCode()
    const minutes = this.codeExpiryMinutes()
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000)

    await this.prisma.verificationCode.create({
      data: { userId, code, type, expiresAt }
    })

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (type === VerificationCodeType.EMAIL_CONFIRMATION) {
      await this.mail.sendVerificationCode(user!.email, code)
    } else {
      await this.mail.sendPasswordResetCode(user!.email, code)
    }
  }

  // ─── Register ─────────────────────────────────────────

  async register (email: string, password: string, role: UserRole) {
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictException('Email already registered')

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await this.prisma.user.create({
      data: { email, passwordHash, role, emailVerified: false }
    })

    if (role === UserRole.SELLER) {
      await this.createAndSendCode(user.id, VerificationCodeType.EMAIL_CONFIRMATION)
      return {
        message: 'Registration successful. Please verify your email.',
        userId: user.id,
        email: user.email,
        role: user.role
      }
    }

    // CUSTOMER: issue tokens immediately (email verification optional later)
    const result = await this.buildTokenResponse(user.id, user.email, user.role)
    return { ...result, user: { ...result.user, emailVerified: false } }
  }

  // ─── Verify Email ─────────────────────────────────────

  async verifyEmail (email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('User not found')
    if (user.emailVerified) throw new BadRequestException('Email already verified')

    const record = await this.prisma.verificationCode.findFirst({
      where: { userId: user.id, type: VerificationCodeType.EMAIL_CONFIRMATION, used: false },
      orderBy: { createdAt: 'desc' }
    })

    if (!record || record.code !== code || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification code')
    }

    await this.prisma.verificationCode.update({ where: { id: record.id }, data: { used: true } })
    await this.prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } })

    const result = await this.buildTokenResponse(user.id, user.email, user.role)
    return { ...result, user: { ...result.user, emailVerified: true } }
  }

  // ─── Resend Code ──────────────────────────────────────

  async resendCode (email: string, type: VerificationCodeType) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new NotFoundException('User not found')
    await this.createAndSendCode(user.id, type)
    return { message: 'Verification code sent' }
  }

  // ─── Login ────────────────────────────────────────────

  async login (email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Invalid credentials')

    // Sellers must verify email before login
    if (user.role === UserRole.SELLER && !user.emailVerified) {
      throw new ForbiddenException({
        message: 'Email not verified',
        userId: user.id,
        email: user.email
      })
    }

    const result = await this.buildTokenResponse(user.id, user.email, user.role)
    return { ...result, user: { ...result.user, emailVerified: user.emailVerified } }
  }

  // ─── Refresh Token ────────────────────────────────────

  async refresh (refreshToken: string) {
    let payload: { sub: string; jti: string }
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET')
      })
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }

    // Check Redis cache first
    const cached = await this.redis.get(`refresh:${payload.jti}`)
    if (cached) {
      const data = JSON.parse(cached)
      if (data.revoked) throw new UnauthorizedException('Refresh token has been revoked')
    } else {
      // Fall back to DB
      const record = await this.prisma.refreshToken.findUnique({ where: { id: payload.jti } })
      if (!record || record.revoked || record.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token')
      }
    }

    // Revoke old token
    await this.prisma.refreshToken.update({ where: { id: payload.jti }, data: { revoked: true } })
    await this.redis.del(`refresh:${payload.jti}`)

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) throw new UnauthorizedException('User not found')

    const accessToken = this.issueAccessToken(user.id, user.email, user.role)
    const newRefreshToken = await this.issueRefreshToken(user.id)

    return { accessToken, refreshToken: newRefreshToken }
  }

  // ─── Logout ───────────────────────────────────────────

  async logout (refreshToken: string) {
    let payload: { jti: string }
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET')
      })
    } catch {
      // Token may already be expired — still try to revoke by token string
      const record = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } })
      if (record) {
        await this.prisma.refreshToken.update({ where: { id: record.id }, data: { revoked: true } })
        await this.redis.del(`refresh:${record.id}`)
      }
      return { message: 'Logged out successfully' }
    }

    await this.prisma.refreshToken.updateMany({
      where: { id: payload.jti },
      data: { revoked: true }
    })
    await this.redis.del(`refresh:${payload.jti}`)
    return { message: 'Logged out successfully' }
  }

  // ─── Forgot Password ──────────────────────────────────

  async forgotPassword (email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    // Always return 200 to prevent email enumeration
    if (user) {
      await this.createAndSendCode(user.id, VerificationCodeType.PASSWORD_RESET)
    }
    return { message: 'If an account with that email exists, a reset code has been sent' }
  }

  // ─── Verify Reset Code ────────────────────────────────

  async verifyResetCode (email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new BadRequestException('Invalid or expired code')

    const record = await this.prisma.verificationCode.findFirst({
      where: { userId: user.id, type: VerificationCodeType.PASSWORD_RESET, used: false },
      orderBy: { createdAt: 'desc' }
    })

    if (!record || record.code !== code || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired code')
    }

    await this.prisma.verificationCode.update({ where: { id: record.id }, data: { used: true } })

    const resetToken = this.issueResetToken(user.id)
    return { message: 'Code verified', resetToken }
  }

  // ─── Reset Password ───────────────────────────────────

  async resetPassword (resetToken: string, password: string) {
    let payload: { sub: string; purpose: string }
    try {
      payload = this.jwt.verify(resetToken, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET')
      })
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token')
    }

    if (payload.purpose !== 'password-reset') {
      throw new UnauthorizedException('Invalid reset token')
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await this.prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } })

    // Revoke ALL refresh tokens for this user (force re-login everywhere)
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId: payload.sub, revoked: false }
    })
    await this.prisma.refreshToken.updateMany({
      where: { userId: payload.sub },
      data: { revoked: true }
    })
    for (const t of tokens) {
      await this.redis.del(`refresh:${t.id}`)
    }

    return { message: 'Password reset successful' }
  }
}
