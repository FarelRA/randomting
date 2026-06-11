import { db, schema } from '../../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID is required' })
  await db.delete(schema.facts).where(eq(schema.facts.id, id))
  return { success: true }
})
