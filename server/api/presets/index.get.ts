import { db, schema } from '../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) throw createError({ statusCode: 401, message: 'Not authenticated' })

  const presets = await db.select().from(schema.presets).where(eq(schema.presets.userId, auth.userId))
  return presets
})
