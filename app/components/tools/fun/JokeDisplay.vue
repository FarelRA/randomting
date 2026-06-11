<template>
  <AppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppSelect v-model="category" label="Category" :options="categoryOptions" />
      </div>
      <AppButton :disabled="loading" @click="fetchJoke">
        {{ loading ? 'Loading...' : 'Tell Me a Joke' }}
      </AppButton>
    </div>
  </AppCard>

  <p v-if="error" class="mt-4 text-sm text-red-500">{{ error }}</p>

  <ResultDisplay :visible="!!joke" :copy-text="joke?.content" :show-confetti="true" class="mt-6">
    <div class="space-y-2">
      <p class="text-lg leading-relaxed text-gray-800 dark:text-gray-200">{{ joke?.content }}</p>
      <p v-if="joke?.category" class="text-xs text-gray-400 dark:text-gray-500">Category: {{ joke.category }}</p>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="random-joke" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const category = ref('all')
const joke = ref<{ content: string; category?: string } | null>(null)
const loading = ref(false)
const error = ref('')
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'programming', label: 'Programming' },
  { value: 'dad', label: 'Dad Jokes' },
  { value: 'puns', label: 'Puns' },
  { value: 'science', label: 'Science' },
  { value: 'general', label: 'General' },
]

async function fetchJoke() {
  loading.value = true
  error.value = ''
  try {
    const { data, error: fetchErr } = await useFetch(`/api/content/jokes?category=${category.value}`)
    if (fetchErr.value) {
      error.value = 'Failed to load joke. Please try again.'
      return
    }
    if (data.value) {
      joke.value = data.value as { content: string; category?: string }
      historyRef.value?.add(joke.value.content)
      celebrate()
    }
  } catch {
    error.value = 'Failed to load joke. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
