<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="text-3xl font-bold">Profile</h1>
        <p v-if="auth.user" class="mt-1 text-gray-600 dark:text-gray-400">
          Signed in as <span class="font-medium">{{ auth.user.username }}</span> ({{ auth.user.email }})
        </p>
      </div>
      <CommonAppButton variant="secondary" size="sm" @click="handleLogout">Sign Out</CommonAppButton>
    </div>

    <div class="mb-8 flex gap-4 border-b border-gray-200 dark:border-gray-700">
      <button v-for="tab in tabs" :key="tab" class="border-b-2 px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === tab ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Loading...</div>

    <template v-else-if="activeTab === 'Presets'">
      <CommonAppCard v-if="presets.length === 0" class="text-center text-gray-500 dark:text-gray-400">
        No presets saved yet. Use a tool and save your configuration.
      </CommonAppCard>
      <div v-else class="space-y-3">
        <div v-for="p in presets" :key="p.id" class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div>
            <p class="font-medium">{{ p.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Tool: {{ p.toolSlug }}</p>
          </div>
          <CommonAppButton variant="ghost" size="sm" @click="deletePreset(p.id)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
            </svg>
          </CommonAppButton>
        </div>
      </div>
    </template>

    <template v-else>
      <CommonAppCard v-if="history.length === 0" class="text-center text-gray-500 dark:text-gray-400">
        No history yet. Start using tools to see your history here.
      </CommonAppCard>
      <div v-else class="space-y-3">
        <div v-for="h in history" :key="h.id" class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="mb-1 text-sm font-medium text-primary-600 dark:text-primary-400">{{ h.toolSlug }}</p>
              <p class="mb-1 text-sm text-gray-700 dark:text-gray-300">{{ h.result }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(h.createdAt) }}</p>
            </div>
            <CommonAppButton variant="ghost" size="sm" @click="deleteHistory(h.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18" /><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
              </svg>
            </CommonAppButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()

const tabs = ['Presets', 'History']
const activeTab = ref('Presets')
const presets = ref<any[]>([])
const history = ref<any[]>([])
const loading = ref(true)

async function loadPresets() {
  try {
    presets.value = await $fetch('/api/presets')
  } catch {}
}

async function loadHistory() {
  try {
    history.value = await $fetch('/api/history')
  } catch {}
}

async function deletePreset(id: string) {
  try {
    await $fetch(`/api/presets/${id}`, { method: 'DELETE' })
    presets.value = presets.value.filter(p => p.id !== id)
  } catch {}
}

async function deleteHistory(id: string) {
  try {
    await $fetch(`/api/history/${id}`, { method: 'DELETE' })
    history.value = history.value.filter(h => h.id !== id)
  } catch {}
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function handleLogout() {
  await auth.logout()
  await navigateTo('/')
}

onMounted(async () => {
  await Promise.all([loadPresets(), loadHistory()])
  loading.value = false
})
</script>
