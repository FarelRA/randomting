import { db, schema } from '../../utils/db'
import { comparePassword, signToken, isAdminEmail } from '../../utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'Email and password are required' })
  }

  const user = await db.select().from(schema.users).where(eq(schema.users.email, body.email)).get()
  if (!user) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const valid = await comparePassword(body.password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const role = isAdminEmail(user.email) ? 'admin' : user.role
  if (role !== user.role) {
    await db.update(schema.users).set({ role }).where(eq(schema.users.id, user.id))
  }

  const token = signToken({ userId: user.id, role })
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { id: user.id, username: user.username, email: user.email, role, createdAt: user.createdAt }
})
