FROM node:22.17-alpine AS builder

WORKDIR /usr/share/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN corepack enable
RUN pnpm install

COPY ./ ./

RUN pnpm prisma generate

RUN pnpm run build

FROM alpine:latest

WORKDIR /usr/share/app

ARG NODE_ENV=development # Or production
ENV NODE_ENV=${NODE_ENV}

RUN apk add --no-cache nodejs pnpm

COPY --from=builder /usr/share/app/generated ./generated
COPY --from=builder /usr/share/app/dist ./dist
COPY --from=builder /usr/share/app/package*.json ./
COPY --from=builder /usr/share/app/pnpm-lock.yaml ./

RUN pnpm install -P
RUN pnpm cache clear

EXPOSE 3000

CMD ["node", "dist/main"]
