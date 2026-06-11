import { db, schema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.content) throw createError({ statusCode: 400, message: 'Content is required' })
  if (!body.author) throw createError({ statusCode: 400, message: 'Author is required' })
  const now = Math.floor(Date.now() / 1000)
  await db.insert(schema.quotes).values({
    id: crypto.randomUUID(),
    content: body.content,
    author: body.author,
    category: body.category || 'general',
    source: body.source || null,
    active: body.active ?? 1,
    createdAt: now,
  })
  return { success: true }
})
