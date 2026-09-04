export function useToolConfig(config: Record<string, Ref<any>>, prefix?: string) {
  const route = useRoute()
  const router = useRouter()
  const sharedConfig = inject<Ref<Record<string, any>> | null>('toolConfig', null)
  let timeout: ReturnType<typeof setTimeout> | null = null
  let firstSync = true

  function paramKey(key: string) {
    return prefix ? `${prefix}_${key}` : key
  }

  function syncShared() {
    if (!sharedConfig) return
    for (const [key, ref] of Object.entries(config)) {
      sharedConfig.value[paramKey(key)] = ref.value
    }
  }

  function init() {
    for (const [key, ref] of Object.entries(config)) {
      const val = route.query[paramKey(key)]
      if (val !== undefined) {
        const num = Number(val)
        ref.value = Number.isFinite(num) ? num : val
      }
    }
  }

  function syncToUrl() {
    const query: Record<string, any> = { ...route.query }
    for (const [key, ref] of Object.entries(config)) {
      if (ref.value !== undefined && ref.value !== null && ref.value !== '') {
        query[paramKey(key)] = String(ref.value)
      } else {
        delete query[paramKey(key)]
      }
    }
    router.replace({ query })
  }

  function debouncedSync() {
    if (firstSync) { firstSync = false; return }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(syncToUrl, 500)
  }

  init()

  for (const [key, ref] of Object.entries(config)) {
    watch(ref, debouncedSync, { deep: true })
    if (sharedConfig) {
      sharedConfig.value[paramKey(key)] = ref.value
      watch(ref, syncShared, { deep: true })
    }
  }

  onUnmounted(() => {
    if (timeout) clearTimeout(timeout)
  })

  return { init, syncToUrl }
}
