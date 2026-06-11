import { db, schema } from '../../utils/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const user = await db.select().from(schema.users).where(eq(schema.users.id, auth.userId)).get()
  if (!user) {
    throw createError({ statusCode: 401, message: 'User not found' })
  }

  return { id: user.id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt }
})
