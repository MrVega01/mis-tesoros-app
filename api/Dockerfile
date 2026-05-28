FROM node:20-alpine AS builder
RUN npm install -g pnpm@10
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm exec prisma generate --schema=prisma/schema.prisma
RUN pnpm run build

FROM node:20-alpine
RUN npm install -g pnpm@10
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
ARG DATABASE_URL=postgresql://x:x@localhost/x
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm exec prisma generate --schema=prisma/schema.prisma
EXPOSE 3000
CMD ["node", "dist/main"]
