import { db, schema } from '../../utils/db'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const entries = await db.select()
    .from(schema.history)
    .where(eq(schema.history.userId, auth.userId))
    .orderBy(desc(schema.history.createdAt))
    .limit(50)

  return entries
})
