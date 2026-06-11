export function useAppPWA() {
  const isOnline = ref(true)
  const isInstallable = ref(false)
  const updateAvailable = ref(false)
  const pushSupported = ref(false)
  const pushSubscribed = ref(false)
  const deferredPrompt = ref<any>(null)

  function updateOnlineStatus() {
    isOnline.value = navigator.onLine
  }

  function setupListeners() {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstallable.value = false
      deferredPrompt.value = null
    })
  }

  async function install() {
    if (!deferredPrompt.value) return
    deferredPrompt.value.prompt()
    const result = await deferredPrompt.value.userChoice
    if (result.outcome === 'accepted') {
      isInstallable.value = false
    }
    deferredPrompt.value = null
  }

  function checkForUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        updateAvailable.value = true
      })
    }
  }

  async function checkPushSupport() {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      pushSupported.value = false
      return
    }
    pushSupported.value = true
    const permission = Notification.permission
    if (permission === 'granted') {
      pushSubscribed.value = true
    }
  }

  async function subscribePush() {
    if (!pushSupported.value) return
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return
    try {
      const registration = await navigator.serviceWorker.ready
      const { publicKey } = await $fetch('/api/push/vapid-key')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      })
      await $fetch('/api/push/subscribe', {
        method: 'POST',
        body: subscription.toJSON(),
      })
      pushSubscribed.value = true
    } catch {
      pushSubscribed.value = false
    }
  }

  onMounted(() => {
    updateOnlineStatus()
    setupListeners()
    checkForUpdates()
    checkPushSupport()
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return {
    isOnline: readonly(isOnline),
    isInstallable: readonly(isInstallable),
    updateAvailable: readonly(updateAvailable),
    pushSupported: readonly(pushSupported),
    pushSubscribed: readonly(pushSubscribed),
    install,
    subscribePush,
  }
}
