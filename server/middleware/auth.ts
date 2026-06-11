import { verifyToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (!url.pathname.startsWith('/api/')) return

  const token = getCookie(event, 'token')
  if (!token) return

  try {
    const payload = verifyToken(token)
    event.context.auth = { userId: payload.userId, role: payload.role }
  } catch {
    deleteCookie(event, 'token', { path: '/' })
  }
})
