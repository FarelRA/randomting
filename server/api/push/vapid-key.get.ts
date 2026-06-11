import { getVapidPublicKey } from '../../utils/push'

export default defineEventHandler(() => {
  return { publicKey: getVapidPublicKey() }
})
