import { getVapidPublicKey } from '../../utils/push'

if (!globalThis.__pushSubscriptions) {
  globalThis.__pushSubscriptions = new Map<string, any>()
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.endpoint || !body.keys) {
    throw createError({ statusCode: 400, message: 'Invalid subscription' })
  }
  const userId = event.context.auth?.userId || 'anonymous'
  globalThis.__pushSubscriptions.set(body.endpoint, { ...body, userId, createdAt: Date.now() })
  return { success: true }
})

export function getPushSubscriptions() {
  return Array.from(globalThis.__pushSubscriptions?.values() || [])
}
