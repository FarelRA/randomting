export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.endpoint) {
    throw createError({ statusCode: 400, message: 'Endpoint is required' })
  }
  if (globalThis.__pushSubscriptions) {
    globalThis.__pushSubscriptions.delete(body.endpoint)
  }
  return { success: true }
})
