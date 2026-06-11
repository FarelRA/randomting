import { db, schema } from '../../utils/db'
import { desc, ne } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const all = await db.select().from(schema.rooms)
    .where(ne(schema.rooms.status, 'finished'))
    .orderBy(desc(schema.rooms.createdAt))

  const roomsMap = globalThis.__rooms
    ? (globalThis.__rooms as Map<string, any>)
    : new Map()

  return all.map(r => ({
    id: r.id,
    hostId: r.hostId,
    name: r.name,
    tool: r.tool,
    config: JSON.parse(r.config || '{}'),
    status: r.status,
    maxPlayers: r.maxPlayers,
    createdAt: r.createdAt,
    onlinePlayers: roomsMap.has(r.id) ? roomsMap.get(r.id)!.players.size : 0,
  }))
})
