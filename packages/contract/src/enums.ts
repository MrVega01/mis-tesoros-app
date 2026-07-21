/**
 * Shared enums — the single source of truth for the string values that both the
 * API (`api/`) and the mobile app (`mobile/`) must agree on.
 *
 * These mirror the Prisma-generated `UserRole` / `VerificationCodeType` enums
 * (`@prisma/client`), which remain the DATABASE source of truth. The API should
 * assert at compile time that these stay assignable to the Prisma enums so the
 * two definitions can never silently drift (see the package README).
 *
 * Authored as `const` objects (not TS `enum`) so the compiled output is plain
 * JS that Metro/Expo can bundle directly, while TS consumers still get a union
 * type of the same name.
 */

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER'
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const VerificationCodeType = {
  EMAIL_CONFIRMATION: 'EMAIL_CONFIRMATION',
  PASSWORD_RESET: 'PASSWORD_RESET'
} as const

export type VerificationCodeType =
  (typeof VerificationCodeType)[keyof typeof VerificationCodeType]

/**
 * Semantic auth error codes — the shared vocabulary the API can return and the
 * mobile app can branch on. NOT i18n keys: the mobile app maps these codes to
 * its own localized strings (keep `AUTH_ERROR_KEYS` in the mobile app).
 */
export const AuthErrorCode = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_UNVERIFIED: 'EMAIL_UNVERIFIED',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  INVALID_CODE: 'INVALID_CODE',
  RESET_TOKEN_EXPIRED: 'RESET_TOKEN_EXPIRED'
} as const

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode]
