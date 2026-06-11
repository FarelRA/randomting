import { db, schema } from '../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID is required' })

  const [room] = await db.select().from(schema.rooms).where(eq(schema.rooms.id, id))
  if (!room) throw createError({ statusCode: 404, message: 'Room not found' })
  if (room.hostId !== auth.userId && auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Only the host can delete this room' })
  }

  await db.delete(schema.rooms).where(eq(schema.rooms.id, id))

  const roomsMap = globalThis.__rooms as Map<string, any> | undefined
  if (roomsMap) roomsMap.delete(id)

  return { success: true }
})
