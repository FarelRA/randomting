import { db, schema } from '../../utils/db'
import { hashPassword, signToken } from '../../utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.username || !body.email || !body.password) {
    throw createError({ statusCode: 400, message: 'Username, email, and password are required' })
  }
  if (body.password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters' })
  }

  const existing = await db.select().from(schema.users).where(eq(schema.users.email, body.email)).get()
  if (existing) {
    throw createError({ statusCode: 409, message: 'Email already registered' })
  }

  const now = Math.floor(Date.now() / 1000)
  const passwordHash = await hashPassword(body.password)
  const id = crypto.randomUUID()

  await db.insert(schema.users).values({
    id,
    username: body.username,
    email: body.email,
    passwordHash,
    role: 'user',
    createdAt: now,
  })

  const token = signToken({ userId: id, role: 'user' })
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { id, username: body.username, email: body.email, role: 'user', createdAt: now }
})
