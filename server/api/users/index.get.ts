import { db, schema } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth
  if (!auth || auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  const users = await db.select({
    id: schema.users.id,
    username: schema.users.username,
    email: schema.users.email,
    role: schema.users.role,
    createdAt: schema.users.createdAt,
  }).from(schema.users).orderBy(schema.users.createdAt)

  return users
})
