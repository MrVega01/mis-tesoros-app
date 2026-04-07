// Jest shim for generated/prisma/client
// Re-exports real enums (generated/prisma/enums.ts is ESM-safe) and stubs PrismaClient.
// PrismaService is fully mocked in every test, so the real PrismaClient is never called.

export * from '../../generated/prisma/enums'

export class PrismaClient {
  $connect = jest.fn()
  $disconnect = jest.fn()
}
