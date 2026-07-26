import { Prisma } from '@prisma/client'

/**
 * Prisma known-request error codes the services branch on.
 * Reference: https://www.prisma.io/docs/orm/reference/error-reference
 */
export const PRISMA_ERROR = {
  UNIQUE_VIOLATION: 'P2002',
  FOREIGN_KEY_VIOLATION: 'P2003',
  RECORD_NOT_FOUND: 'P2025'
} as const

export type PrismaErrorCode = (typeof PRISMA_ERROR)[keyof typeof PRISMA_ERROR]

/**
 * Narrows an unknown caught value to a Prisma error with a specific code, so
 * callers do not repeat the `instanceof` + `.code` dance at every catch site.
 */
export function isPrismaError(
  error: unknown,
  code: PrismaErrorCode
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
  )
}
