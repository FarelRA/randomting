<template>
  <AppCard>
    <form class="space-y-6" @submit.prevent="handleCreate">
      <AppInput v-model="roomName" label="Room Name" placeholder="Enter a name for your room" :error="nameError" />

      <AppSelect v-model="selectedTool" label="Game / Tool" placeholder="Select a tool" :options="toolOptions" />

      <AppInput v-model.number="maxPlayers" label="Max Players" type="number" :min="2" :max="20" />

      <p v-if="createError" class="text-sm text-red-500">{{ createError }}</p>

      <AppButton type="submit" class="w-full" :disabled="!canSubmit || creating">
        {{ creating ? 'Creating...' : 'Create Room' }}
      </AppButton>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
const auth = useAuthStore()

const roomName = ref('')
const selectedTool = ref('')
const maxPlayers = ref(8)
const nameError = ref('')
const createError = ref('')
const creating = ref(false)

const toolOptions = [
  { value: 'spin-wheel', label: 'Shared Spin Wheel' },
  { value: 'dice', label: 'Multiplayer Dice' },
  { value: 'lottery', label: 'Group Lottery' },
  { value: 'battle', label: 'Random Battle' },
]

const canSubmit = computed(() => roomName.value.trim() && selectedTool.value)

watch(roomName, () => {
  if (roomName.value.trim()) nameError.value = ''
})

async function handleCreate() {
  if (!canSubmit.value) return
  if (!auth.isAuthenticated) {
    createError.value = 'You must be logged in to create a room'
    return
  }

  creating.value = true
  createError.value = ''

  try {
    const data = await $fetch('/api/rooms', {
      method: 'POST',
      body: {
        name: roomName.value.trim(),
        tool: selectedTool.value,
        maxPlayers: maxPlayers.value,
        config: {},
      },
    })
    await navigateTo(`/multiplayer/room/${(data as any).id}`)
  } catch (err: any) {
    createError.value = err?.data?.message || err?.message || 'Failed to create room'
  } finally {
    creating.value = false
  }
}
</script>
