import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'randomting-secret-change-in-production'
const JWT_EXPIRES = '7d'

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string; iat: number; exp: number }
}

export function requireAuth(event: H3Event) {
  const auth = event.context.auth as { userId: string; role: string } | undefined
  if (!auth) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }
  return auth
}

export function requireAdmin(event: H3Event) {
  const auth = requireAuth(event)
  if (auth.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }
  return auth
}

export function isAdminEmail(email?: string) {
  if (!email) return false
  const admins = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()).filter(Boolean) ?? []
  return admins.includes(email.toLowerCase())
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
