export function useToolConfig(config: Record<string, Ref<any>>, prefix?: string) {
  const route = useRoute()
  const router = useRouter()
  let timeout: ReturnType<typeof setTimeout> | null = null

  function init() {
    for (const [key, ref] of Object.entries(config)) {
      const paramKey = prefix ? `${prefix}_${key}` : key
      const val = route.query[paramKey]
      if (val !== undefined) {
        const num = Number(val)
        ref.value = Number.isFinite(num) ? num : val
      }
    }
  }

  function syncToUrl() {
    const query: Record<string, any> = { ...route.query }
    for (const [key, ref] of Object.entries(config)) {
      const paramKey = prefix ? `${prefix}_${key}` : key
      if (ref.value !== undefined && ref.value !== null && ref.value !== '') {
        query[paramKey] = String(ref.value)
      } else {
        delete query[paramKey]
      }
    }
    router.replace({ query })
  }

  function debouncedSync() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(syncToUrl, 500)
  }

  for (const [, ref] of Object.entries(config)) {
    watch(ref, debouncedSync, { deep: true })
  }

  onMounted(init)

  onUnmounted(() => {
    if (timeout) clearTimeout(timeout)
  })

  return { init, syncToUrl }
}
