# @mis-tesoros/contract

Shared cross-app contract consumed by both `api/` (NestJS) and `mobile/` (Expo).
One source of truth for the values and shapes both sides must agree on.

## Status

- ✅ **Enums slice** — `UserRole`, `VerificationCodeType`, `AuthErrorCode`.
- ⏳ Planned — Zod request schemas (`registerSchema`, `loginSchema`, …) and
  response types (tokens, user), so validation lives in one place.

## Usage

Add as a workspace dependency in a consumer's `package.json`:

```json
{ "dependencies": { "@mis-tesoros/contract": "workspace:*" } }
```

Then:

```ts
import { UserRole, VerificationCodeType, AuthErrorCode } from '@mis-tesoros/contract'
```

The mobile app (JS) imports the same values at runtime; the API (TS) also gets
the union types.

## Build

Ships compiled JS + `.d.ts` from `dist/` so Metro never has to transpile a
foreign TS package.

```bash
pnpm --filter @mis-tesoros/contract build   # one-off
pnpm --filter @mis-tesoros/contract dev     # tsc --watch during development
```

## Keep in sync with Prisma

`UserRole` / `VerificationCodeType` mirror the Prisma-generated enums
(`@prisma/client`), which stay the **database** source of truth. To guarantee
they never drift, add a compile-time assertion in the API, e.g.:

```ts
import { UserRole as ContractRole } from '@mis-tesoros/contract'
import { UserRole as PrismaRole } from '@prisma/client'

// Fails to compile if the two enums diverge.
const _assert: ContractRole = '' as PrismaRole
```
