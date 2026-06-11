import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET || 'randomting-secret-change-in-production'
const JWT_EXPIRES = '7d'

export function signToken(payload: { userId: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; role: string; iat: number; exp: number }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
