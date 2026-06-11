<template>
  <div v-if="status !== 'connected'" class="fixed bottom-4 right-4 z-50">
    <div
      class="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm"
      :class="indicatorClass"
    >
      <span class="h-2 w-2 rounded-full" :class="dotClass" />
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { status, connected } = useWebSocket()

const indicatorClass = computed(() => {
  if (status.value === 'connecting' || status.value === 'reconnecting') {
    return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
  }
  if (status.value === 'disconnected') {
    return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
  }
  return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
})

const dotClass = computed(() => {
  if (status.value === 'connecting' || status.value === 'reconnecting') return 'bg-amber-500 animate-pulse'
  if (status.value === 'disconnected') return 'bg-red-500'
  return 'bg-green-500'
})

const label = computed(() => {
  if (status.value === 'connecting') return 'Connecting...'
  if (status.value === 'reconnecting') return 'Reconnecting...'
  if (status.value === 'disconnected') return 'Disconnected'
  return 'Connected'
})
</script>
