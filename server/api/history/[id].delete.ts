import { db, schema } from '../../utils/db'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'History ID is required' })

  await db.delete(schema.history).where(and(eq(schema.history.id, id), eq(schema.history.userId, auth.userId)))
  return { success: true }
})
