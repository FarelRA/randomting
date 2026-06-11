<template>
  <AppCard>
    <div class="space-y-4">
      <AppButton :disabled="loading" @click="fetchQuote">
        {{ loading ? 'Loading...' : 'Show Me a Quote' }}
      </AppButton>
    </div>
  </AppCard>

  <p v-if="error" class="mt-4 text-sm text-red-500">{{ error }}</p>

  <ResultDisplay :visible="!!quote" :copy-text="quote ? `${quote.content} — ${quote.author}` : undefined" :show-confetti="true" class="mt-6">
    <div class="space-y-3">
      <blockquote class="border-l-4 border-primary-500 pl-4 text-lg italic leading-relaxed text-gray-700 dark:text-gray-300">
        &ldquo;{{ quote?.content }}&rdquo;
      </blockquote>
      <p class="text-right text-sm font-semibold text-gray-600 dark:text-gray-400">&mdash; {{ quote?.author }}</p>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="random-quote" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const quote = ref<{ content: string; author: string } | null>(null)
const loading = ref(false)
const error = ref('')
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

async function fetchQuote() {
  loading.value = true
  error.value = ''
  try {
    const { data, error: fetchErr } = await useFetch('/api/content/quotes')
    if (fetchErr.value) {
      error.value = 'Failed to load quote. Please try again.'
      return
    }
    if (data.value) {
      quote.value = data.value as { content: string; author: string }
      historyRef.value?.add(`${quote.value.content} — ${quote.value.author}`)
      celebrate()
    }
  } catch {
    error.value = 'Failed to load quote. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
