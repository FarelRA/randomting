import { db, schema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const body = await readBody(event)
  if (!body.toolSlug || !body.result) {
    throw createError({ statusCode: 400, message: 'ToolSlug and result are required' })
  }

  const now = Math.floor(Date.now() / 1000)
  const id = crypto.randomUUID()

  await db.insert(schema.history).values({
    id,
    userId: auth.userId,
    toolSlug: body.toolSlug,
    input: typeof body.input === 'string' ? body.input : JSON.stringify(body.input || {}),
    result: typeof body.result === 'string' ? body.result : JSON.stringify(body.result),
    createdAt: now,
  })

  return { id, toolSlug: body.toolSlug, createdAt: now }
})
