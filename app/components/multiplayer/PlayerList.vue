<template>
  <div class="space-y-2">
    <div
      v-for="player in players"
      :key="player.id"
      class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
      :class="{ 'ring-2 ring-primary-500': player.id === hostId }"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
          :style="{ backgroundColor: stringToColor(player.username) }"
        >
          {{ player.username.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="text-sm font-medium">
            {{ player.username }}
            <span v-if="player.id === hostId" class="ml-1 text-xs text-amber-600 dark:text-amber-400">(Host)</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="player.ready" class="text-xs font-medium text-green-600 dark:text-green-400">
          Ready
        </span>
        <span v-else class="text-xs text-gray-400 dark:text-gray-500">
          Not Ready
        </span>
        <button
          v-if="isHost && player.id !== hostId"
          class="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          :title="`Kick ${player.username}`"
          @click="$emit('kick', player.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 15l-5 5m0-5l5 5" />
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  players: Array<{ id: string; username: string; ready: boolean }>
  hostId: string
  isHost: boolean
}>()

defineEmits<{
  kick: [userId: string]
}>()

function stringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 65%, 50%)`
}
</script>
