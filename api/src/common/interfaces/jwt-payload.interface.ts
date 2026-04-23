import { UserRole } from '@generated/prisma/client'

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
}

export interface RefreshTokenPayload {
  sub: string
  jti: string
}

export interface ResetTokenPayload {
  sub: string
  purpose: 'password-reset'
}
