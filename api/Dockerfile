# Workspace-aware build. Build context is the REPO ROOT (see docker-compose.yml),
# so the shared @mis-tesoros/contract package and the root pnpm lockfile are
# available. Only the API subtree is installed/built — mobile is never touched.

# ─── Builder ──────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /repo

# Manifests + the (tiny) contract source. The contract source is copied BEFORE
# install so its `prepare` (tsc) can build it during install. mobile/package.json
# is required only so pnpm can resolve the workspace against the frozen lockfile.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/contract ./packages/contract
COPY api/package.json ./api/
COPY mobile/package.json ./mobile/

# Install deps for the API and its workspace dependencies (contract) only; this
# also builds the contract via its prepare script.
RUN pnpm install --frozen-lockfile --filter @mis-tesoros/api...

# API source, Prisma client, then the Nest build (type-checks against the contract).
COPY api ./api
WORKDIR /repo/api
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm exec prisma generate --schema=prisma/schema.prisma
RUN pnpm run build

# ─── Runtime ──────────────────────────────────────────────
FROM node:20-alpine
RUN npm install -g pnpm@10
WORKDIR /repo

# Manifests only. @mis-tesoros/contract is a type-only devDependency of the API
# (fully erased at build time), so its manifest is present for workspace
# resolution but --prod + a non-recursive filter never install or build it.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/contract/package.json ./packages/contract/
COPY api/package.json ./api/
COPY mobile/package.json ./mobile/

RUN pnpm install --frozen-lockfile --prod --filter @mis-tesoros/api

COPY --from=builder /repo/api/dist ./api/dist
COPY api/prisma ./api/prisma

WORKDIR /repo/api
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm exec prisma generate --schema=prisma/schema.prisma
EXPOSE 3000
CMD ["node", "dist/main"]
