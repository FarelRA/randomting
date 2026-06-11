import { db, schema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  if (!body.name || !body.tool) {
    throw createError({ statusCode: 400, message: 'name and tool are required' })
  }

  const now = Math.floor(Date.now() / 1000)
  const id = crypto.randomUUID()

  await db.insert(schema.rooms).values({
    id,
    hostId: auth.userId,
    name: body.name,
    tool: body.tool,
    config: JSON.stringify(body.config || {}),
    status: 'waiting',
    maxPlayers: Math.min(Math.max(parseInt(body.maxPlayers) || 8, 2), 20),
    createdAt: now,
  })

  return { id, name: body.name, tool: body.tool, hostId: auth.userId, createdAt: now }
})
