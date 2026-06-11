import webPush from 'web-push'

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
const vapidEmail = process.env.VAPID_EMAIL

const vapidConfigured = !!(vapidPublicKey && vapidPrivateKey && vapidEmail)

if (vapidConfigured) {
  webPush.setVapidDetails(`mailto:${vapidEmail!}`, vapidPublicKey!, vapidPrivateKey!)
}

export function getVapidPublicKey() {
  return vapidPublicKey || ''
}

export async function sendPushNotification(subscription: webPush.PushSubscription, payload: object) {
  if (!vapidConfigured) return false
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}
