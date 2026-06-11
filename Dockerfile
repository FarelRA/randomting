FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN npm install

COPY . .
RUN npx nuxi build

FROM node:22-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxt

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package.json /app/package.json

RUN mkdir -p /app/data && chown -R nuxt:nodejs /app/data

USER nuxt
EXPOSE 3000
EXPOSE 3002

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NUXT_SOCKET_PORT=3002

CMD ["node", ".output/server/index.mjs"]
