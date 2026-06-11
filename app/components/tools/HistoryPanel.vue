<template>
  <AppCard v-if="items.length > 0" class="mt-6">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">History</h3>
      <AppButton variant="ghost" size="sm" @click="clear">
        Clear
      </AppButton>
    </div>
    <div class="space-y-2">
      <div v-for="(item, i) in items.slice().reverse()" :key="i" class="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800/50">
        <span class="truncate font-mono">{{ item }}</span>
        <CopyButton :text="item" />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  storageKey: string
  maxItems?: number
}>(), {
  maxItems: 20,
})

const auth = useAuthStore()
const items = ref<string[]>([])

function load() {
  try {
    const raw = localStorage.getItem(`history:${props.storageKey}`)
    items.value = raw ? JSON.parse(raw) : []
  } catch {
    items.value = []
  }
}

function addToLocal(value: string) {
  items.value.push(value)
  if (items.value.length > props.maxItems) {
    items.value = items.value.slice(-props.maxItems)
  }
  localStorage.setItem(`history:${props.storageKey}`, JSON.stringify(items.value))
}

async function add(value: string) {
  if (auth.isAuthenticated) {
    try {
      await $fetch('/api/history', {
        method: 'POST',
        body: { toolSlug: props.storageKey, result: value },
      })
    } catch {}
  }
  addToLocal(value)
}

function clear() {
  items.value = []
  localStorage.setItem(`history:${props.storageKey}`, '[]')
}

onMounted(load)

defineExpose({ add })
</script>
