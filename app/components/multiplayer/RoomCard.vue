<template>
  <NuxtLink :to="`/multiplayer/room/${room.id}`" class="block">
    <CommonAppCard hover>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="font-semibold">{{ room.name }}</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ toolLabel }}</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{{ room.onlinePlayers }}/{{ room.maxPlayers }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        </div>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          :class="statusClass"
        >
          {{ room.status }}
        </span>
        <span v-if="room.onlinePlayers > 0" class="text-xs text-green-600 dark:text-green-400">
          {{ room.onlinePlayers }} online
        </span>
      </div>
    </CommonAppCard>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  room: {
    id: string
    name: string
    tool: string
    status: string
    maxPlayers: number
    onlinePlayers: number
  }
}>()

const toolLabels: Record<string, string> = {
  'spin-wheel': 'Shared Spin Wheel',
  'dice': 'Multiplayer Dice',
  'lottery': 'Group Lottery',
  'battle': 'Random Battle',
}

const toolLabel = computed(() => {
  return toolLabels[(props.room as any).tool] || (props.room as any).tool || 'Unknown'
})

const statusClass = computed(() => {
  const status = (props.room as any).status
  if (status === 'waiting') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
  if (status === 'playing') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
  return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
})
</script>
