<template>
  <AppCard>
    <div class="space-y-4 text-center">
      <p class="text-gray-600 dark:text-gray-400">Ask a yes/no question and let the oracle decide.</p>
      <AppInput v-model="question" placeholder="Type your question..." />
      <AppButton :disabled="!question.trim()" @click="ask">
        Ask the Oracle
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="result?.answer" :show-confetti="result?.answer === 'Yes'" class="mt-6">
    <div class="text-center">
      <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">{{ result?.question }}</p>
      <p class="text-4xl font-bold" :class="answerColor">{{ result?.answer }}</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ result?.detail }}</p>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="yes-no-oracle" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const question = ref('')
const result = ref<{ question: string; answer: string; detail: string } | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen, pickWeighted } = useSeededRandom()

const answers = [
  { answer: 'Yes', weight: 3, color: 'text-green-600 dark:text-green-400', detail: 'It is certain.' },
  { answer: 'No', weight: 3, color: 'text-red-600 dark:text-red-400', detail: 'Don\'t count on it.' },
  { answer: 'Maybe', weight: 2, color: 'text-yellow-600 dark:text-yellow-400', detail: 'Ask again later.' },
  { answer: 'Absolutely', weight: 2, color: 'text-green-600 dark:text-green-400', detail: 'Without a doubt.' },
  { answer: 'Never', weight: 2, color: 'text-red-600 dark:text-red-400', detail: 'My sources say no.' },
  { answer: 'Likely', weight: 2, color: 'text-blue-600 dark:text-blue-400', detail: 'Signs point to yes.' },
  { answer: 'Unlikely', weight: 2, color: 'text-orange-600 dark:text-orange-400', detail: 'Very doubtful.' },
  { answer: 'Definitely', weight: 1, color: 'text-green-600 dark:text-green-400', detail: 'You can rely on it.' },
]

const answerColor = computed(() => {
  if (!result.value) return ''
  const found = answers.find(a => a.answer === result.value!.answer)
  return found?.color || ''
})

function ask() {
  const chosen = pickWeighted(answers, answers.map(a => a.weight))
  result.value = { question: question.value, answer: chosen.answer, detail: chosen.detail }
  historyRef.value?.add(`${question.value}: ${chosen.answer}`)
  if (chosen.answer === 'Yes' || chosen.answer === 'Absolutely' || chosen.answer === 'Definitely') {
    celebrate()
  }
}
</script>
