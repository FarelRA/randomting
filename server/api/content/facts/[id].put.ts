import { db, schema } from '../../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'ID is required' })
  await db.update(schema.facts).set({
    content: body.content,
    category: body.category,
    source: body.source,
    active: body.active,
  }).where(eq(schema.facts.id, id))
  return { success: true }
})
