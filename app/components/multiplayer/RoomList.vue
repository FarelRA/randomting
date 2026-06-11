<template>
  <div v-if="loading" class="flex justify-center py-12">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 dark:border-gray-600 dark:border-t-primary-400" />
  </div>
  <div v-else-if="rooms.length === 0" class="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No active rooms</h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a room to get started</p>
    <CommonAppButton to="/multiplayer/create" class="mt-6">
      Create Your First Room
    </CommonAppButton>
  </div>
  <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <MultiplayerRoomCard v-for="room in rooms" :key="room.id" :room="room" />
  </div>
</template>

<script setup lang="ts">
const rooms = ref<any[]>([])
const loading = ref(true)

async function fetchRooms() {
  loading.value = true
  try {
    const data = await $fetch('/api/rooms')
    rooms.value = data as any[]
  } catch {
    rooms.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRooms)

const poll = setInterval(fetchRooms, 10000)

onUnmounted(() => clearInterval(poll))
</script>
