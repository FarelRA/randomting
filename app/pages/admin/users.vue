<template>
  <div>
    <NuxtLink to="/admin" class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
      Dashboard
    </NuxtLink>

    <div class="mb-6">
      <h1 class="text-2xl font-bold">Users</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Manage registered users</p>
    </div>

    <div v-if="loading" class="space-y-4">
      <CommonLoadingSkeleton v-for="i in 5" :key="i" lines="1" :widths="['100%']" />
    </div>

    <div v-else-if="users.length === 0" class="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
      <p class="text-gray-500 dark:text-gray-400">No users found.</p>
    </div>

    <div v-else class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table class="w-full text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Username</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Email</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Role</th>
            <th class="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Joined</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
            <td class="px-4 py-3 font-medium">{{ user.username }}</td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="user.role === 'admin' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'">
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: number
}

const users = ref<User[]>([])
const loading = ref(true)

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString()
}

onMounted(async () => {
  try {
    users.value = await $fetch('/api/users')
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
})
</script>
