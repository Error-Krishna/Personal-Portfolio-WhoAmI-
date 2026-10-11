FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @portfolio/contracts build
RUN pnpm --filter @portfolio/api build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/packages/contracts ./packages/contracts
COPY --from=builder /app/apps/api ./apps/api

RUN pnpm install --prod --frozen-lockfile

EXPOSE 5000
CMD ["pnpm", "--filter", "@portfolio/api", "start"]
