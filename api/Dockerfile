FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
RUN npx prisma generate --schema=prisma/schema.prisma
EXPOSE 3000
CMD ["node", "dist/main"]
