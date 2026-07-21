/**
 * Compile-time guarantee that the shared `@mis-tesoros/contract` enums stay in
 * sync with the Prisma-generated enums (`@prisma/client`), which remain the
 * DATABASE source of truth.
 *
 * These are type-only assertions — no runtime output. If either enum gains,
 * removes, or renames a member without the other following, one of the
 * bidirectional `AssertExtends` checks below fails to compile and `nest build`
 * breaks. Nothing needs to import this file; it is type-checked as part of the
 * project compilation.
 */
import {
  UserRole as ContractUserRole,
  VerificationCodeType as ContractVerificationCodeType
} from '@mis-tesoros/contract'
import {
  UserRole as PrismaUserRole,
  VerificationCodeType as PrismaVerificationCodeType
} from '@prisma/client'

// Compiles only when A is assignable to B. Applied both directions, this asserts
// the two string-literal unions are exactly equal.
type AssertExtends<A extends B, B> = A

export type _UserRoleMatchesPrisma = AssertExtends<
  AssertExtends<ContractUserRole, PrismaUserRole>,
  AssertExtends<PrismaUserRole, ContractUserRole>
>

export type _VerificationCodeTypeMatchesPrisma = AssertExtends<
  AssertExtends<ContractVerificationCodeType, PrismaVerificationCodeType>,
  AssertExtends<PrismaVerificationCodeType, ContractVerificationCodeType>
>
