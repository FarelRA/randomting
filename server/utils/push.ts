import webPush from 'web-push'

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || 'BECI_7Jp_DGGCNZ7rR9iGEC_qkYUxvBVwT6s6UJ5V6GhlUjOQnNJMxG8jVLPHMBE5Tds6aRkQsxqLqWMBhPqO4s'
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 'mock-private-key-change-in-production'
const vapidEmail = process.env.VAPID_EMAIL || 'admin@randomting.app'

webPush.setVapidDetails(`mailto:${vapidEmail}`, vapidPublicKey, vapidPrivateKey)

export function getVapidPublicKey() {
  return vapidPublicKey
}

export async function sendPushNotification(subscription: webPush.PushSubscription, payload: object) {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}
