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
EXPOSE 3100
EXPOSE 3101

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3100
ENV SOCKET_PORT=3101

CMD ["node", ".output/server/index.mjs"]
