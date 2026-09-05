FROM --platform=$BUILDPLATFORM oven/bun:1-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN cp -r node_modules/@libsql/linux-* node_modules/@libsql/isomorphic-ws .output/server/node_modules/@libsql/ && \
    mkdir -p .output/server/node_modules/@neon-rs && \
    cp -r node_modules/@neon-rs/* .output/server/node_modules/@neon-rs/ || true

FROM oven/bun:1-alpine
WORKDIR /srv
COPY --from=build /app/.output ./
ENV HOST=0.0.0.0 PORT=8080
EXPOSE 8080
CMD ["bun", "server/index.mjs"]
