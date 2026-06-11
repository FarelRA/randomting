import { db, schema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  if (!body.name || !body.toolSlug || !body.config) {
    throw createError({ statusCode: 400, message: 'Name, toolSlug, and config are required' })
  }

  const now = Math.floor(Date.now() / 1000)
  const id = crypto.randomUUID()

  await db.insert(schema.presets).values({
    id,
    userId: auth.userId,
    toolSlug: body.toolSlug,
    name: body.name,
    config: typeof body.config === 'string' ? body.config : JSON.stringify(body.config),
    createdAt: now,
  })

  return { id, userId: auth.userId, toolSlug: body.toolSlug, name: body.name, config: body.config, createdAt: now }
})
