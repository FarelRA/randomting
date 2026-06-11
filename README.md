# Randomting

> One website, all random tools, no ads, no hopping between sites.

[![Nuxt](https://img.shields.io/badge/Nuxt-4.4.8-00DC82?logo=nuxt)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/farel/randomting/pulls)

Randomting is a single-page PWA that bundles **24+ random tools** into one app — number generators, dice rollers, spin wheels, team makers, password generators, multiplayer games, and more. Every tool works offline, configurations are shareable via URL, and multiplayer rooms let you roll dice or spin wheels together in real-time.

---

## Features

### Tools

| Category | Tools |
|---|---|
| **Numbers** | RNG, Dice Roller, Coin Flip, Lottery, Random Date, Random Time |
| **Pickers** | Name Picker, Spin Wheel, Decision Maker, Yes/No Oracle |
| **Groups** | Team Generator, Group Maker, Random Pairing, Tournament Seeding |
| **Strings** | Password Generator, UUID Generator, Lorem Ipsum |
| **Visual** | Color Generator, Gradient Generator, Identicon |
| **Fun** | Random Joke, Random Fact, Random Quote |
| **Interactive** | Slot Machine, Bingo Card |

### Multiplayer (real-time via WebSocket)

- **Shared Spin Wheel** — host spins, everyone watches
- **Multiplayer Dice** — each player rolls, results broadcast
- **Group Lottery** — pool + live draw
- **Random Battle** — 1v1 challenges

### PWA

- Installable on mobile/desktop via service worker
- Full offline support for cached tools
- Push notifications (VAPID) for multiplayer events

### Admin Panel

- CRUD management for jokes, facts, quotes
- User management (roles, listings)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Nuxt 4 (Vue 3, TypeScript) |
| Styling | Tailwind CSS v4 |
| State | Pinia |
| Backend | Nitro server routes |
| Database | SQLite via `@libsql/client` & Drizzle ORM |
| Auth | JWT (bcrypt + jsonwebtoken) |
| Animations | GSAP 3.15 |
| WebSocket | Socket.IO (port 3002) |
| PWA | `@vite-pwa/nuxt` with service worker + manifest |
| Deployment | Docker (multi-stage, nginx reverse proxy) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [Bun](https://bun.sh) or npm

### Installation

```bash
git clone https://github.com/farel/randomting.git
cd randomting
bun install
```

### Development

```bash
bun run dev
```

Opens at `http://localhost:3000`. WebSocket server runs on port 3002 by default (`NUXT_SOCKET_PORT` to change).

### Build for Production

```bash
bun run build
```

Output in `.output/` — run with:

```bash
node .output/server/index.mjs
```

---

## Docker

```bash
docker compose up --build
```

- `:3000` — Nuxt app (via nginx reverse proxy)
- `:3002` — WebSocket (proxied at `/socket.io/`)
- Persistent SQLite volume (`randomting-data`)

See `Dockerfile`, `docker-compose.yml`, and `docker/nginx.conf`.

---

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── admin/            AdminContentManager.vue
│   │   ├── common/           Button, Card, Modal, Toast, etc.
│   │   ├── landing/          Hero, FeatureCard, CategoryGrid
│   │   ├── tools/            ToolWrapper + tool components by category
│   │   └── multiplayer/      RoomList, ChatPanel, SharedSpinWheel, etc.
│   ├── composables/          useWebSocket, useMultiplayer, usePWA, useToolConfig
│   ├── layouts/              default, auth, admin
│   ├── pages/                /tools/[slug], /multiplayer/room/[id], /admin, etc.
│   ├── stores/               auth Pinia store
│   └── app.vue               Root with SEO meta + PWA injection
├── server/
│   ├── api/                  auth, content, presets, history, rooms, push, users
│   ├── middleware/            JWT auth middleware
│   ├── plugins/              Socket.IO server + auto-seed
│   ├── utils/                db, auth helpers, push notification helpers
│   └── routes/               sitemap.xml
├── drizzle/
│   ├── schema.ts             All SQLite table definitions
│   └── seed.ts               Seed data: jokes, facts, quotes, admin user
├── docker/                   nginx.conf
├── nuxt.config.ts            PWA, head meta, app config
├── Dockerfile                Multi-stage build
├── docker-compose.yml        Production compose
└── package.json
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/auth/me` | Current user info |
| GET/POST | `/api/presets` | List / create presets |
| DELETE | `/api/presets/:id` | Delete preset |
| GET/POST | `/api/history` | List / create history entries |
| DELETE | `/api/history/:id` | Delete history entry |
| GET | `/api/content/jokes` / `facts` / `quotes` | Random item |
| GET | `/api/content/jokes/all` (etc.) | All items (admin) |
| POST/PUT/DELETE | `/api/content/:type/:id` | CRUD (admin) |
| GET | `/api/users` | List users (admin) |
| GET | `/api/rooms` | List rooms |
| POST | `/api/rooms` | Create room |
| DELETE | `/api/rooms/:id` | Delete room |
| GET | `/api/push/vapid-key` | VAPID public key |
| POST | `/api/push/subscribe` | Subscribe to push |
| POST | `/api/push/unsubscribe` | Unsubscribe |

---

## Configuration

| Env Var | Default | Description |
|---|---|---|
| `NUXT_SOCKET_PORT` | `3002` | WebSocket server port |
| `JWT_SECRET` | *(random)* | JWT signing secret |
| `VAPID_PUBLIC_KEY` | *(dev key)* | VAPID public key |
| `VAPID_PRIVATE_KEY` | *(dev key)* | VAPID private key |
| `VAPID_EMAIL` | `mailto:example@example.com` | VAPID contact email |

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

[GNU General Public License v3.0](LICENSE)
