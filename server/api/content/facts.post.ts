import { db, schema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.content) throw createError({ statusCode: 400, message: 'Content is required' })
  const now = Math.floor(Date.now() / 1000)
  await db.insert(schema.facts).values({
    id: crypto.randomUUID(),
    content: body.content,
    category: body.category || 'general',
    source: body.source || null,
    active: body.active ?? 1,
    createdAt: now,
  })
  return { success: true }
})
