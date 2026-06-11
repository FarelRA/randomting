<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <CommonAppSelect v-model="category" label="Category" :options="categoryOptions" />
      </div>
      <CommonAppButton :disabled="loading" @click="fetchFact">
        {{ loading ? 'Loading...' : 'Show Me a Fact' }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <p v-if="error" class="mt-4 text-sm text-red-500">{{ error }}</p>

  <ToolsResultDisplay :visible="!!fact" :copy-text="fact?.content" :show-confetti="true" class="mt-6">
    <div class="space-y-2">
      <p class="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{{ fact?.content }}</p>
      <p v-if="fact?.category" class="text-xs text-gray-400 dark:text-gray-500">Category: {{ fact.category }}</p>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="random-fact" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const category = ref('all')
const fact = ref<{ content: string; category?: string } | null>(null)
const loading = ref(false)
const error = ref('')
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'science', label: 'Science' },
  { value: 'technology', label: 'Technology' },
  { value: 'animal', label: 'Animals' },
  { value: 'history', label: 'History' },
  { value: 'general', label: 'General' },
]

async function fetchFact() {
  loading.value = true
  error.value = ''
  try {
    const { data, error: fetchErr } = await useFetch(`/api/content/facts?category=${category.value}`)
    if (fetchErr.value) {
      error.value = 'Failed to load fact. Please try again.'
      return
    }
    if (data.value) {
      fact.value = data.value as { content: string; category?: string }
      historyRef.value?.add(fact.value.content)
      celebrate()
    }
  } catch {
    error.value = 'Failed to load fact. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
