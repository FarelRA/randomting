<template>
  <div>
    <PlayerList :players="players" :host-id="hostId" :is-host="isHost" @kick="$emit('kick', $event)" />

    <div class="mt-6 flex flex-wrap gap-3">
      <AppButton v-if="!isHost" variant="secondary" @click="$emit('ready')">
        {{ iAmReady ? 'Unready' : 'Ready' }}
      </AppButton>
      <AppButton v-if="isHost && allReady" @click="$emit('start')">
        Start Game
      </AppButton>
      <AppButton variant="ghost" class="text-red-500" @click="$emit('leave')">
        Leave Room
      </AppButton>
    </div>

    <p v-if="!isHost && allReady" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
      Waiting for the host to start the game...
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  players: Array<{ id: string; username: string; ready: boolean }>
  hostId: string
  isHost: boolean
  myId: string | undefined
}>()

defineEmits<{
  ready: []
  start: []
  leave: []
  kick: [userId: string]
}>()

const iAmReady = computed(() => {
  return props.players.find(p => p.id === props.myId)?.ready ?? false
})

const allReady = computed(() => {
  return props.players.length >= 1 && props.players.every(p => p.ready)
})
</script>
