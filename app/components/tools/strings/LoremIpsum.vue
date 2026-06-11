<template>
  <AppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppSelect v-model="mode" label="Generate" :options="modeOptions" />
        <AppInput v-model.number="count" label="Count" type="number" :min="1" :max="100" :hint="mode === 'paragraphs' ? '1-100' : '1-1000'" />
      </div>
      <AppButton @click="generate">
        Generate {{ mode === 'paragraphs' ? count + ' Paragraph' : mode === 'sentences' ? count + ' Sentence' : count + ' Word' }}{{ count > 1 ? 's' : '' }}
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="result" :show-confetti="true" class="mt-6">
    <div class="prose prose-sm max-w-none dark:prose-invert">
      <p v-for="(p, i) in result?.split('\n\n')" :key="i" class="text-gray-700 dark:text-gray-300">{{ p }}</p>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="lorem-ipsum" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const mode = ref('paragraphs')
const count = ref(3)
const result = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

const modeOptions = [
  { value: 'paragraphs', label: 'Paragraphs' },
  { value: 'sentences', label: 'Sentences' },
  { value: 'words', label: 'Words' },
]

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum', 'fugiat', 'commodo', 'consequat', 'voluptate', 'pariatur',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
]

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function randomWord(): string {
  return loremWords[Math.floor(gen() * loremWords.length)]
}

function randomSentence(minWords = 5, maxWords = 15): string {
  const len = Math.floor(gen() * (maxWords - minWords + 1)) + minWords
  const words: string[] = []
  for (let i = 0; i < len; i++) {
    words.push(randomWord())
  }
  return capitalize(words.join(' ')) + '.'
}

function randomParagraph(minSentences = 3, maxSentences = 8): string {
  const len = Math.floor(gen() * (maxSentences - minSentences + 1)) + minSentences
  const sentences: string[] = []
  for (let i = 0; i < len; i++) {
    sentences.push(randomSentence())
  }
  return sentences.join(' ')
}

function generate() {
  if (mode.value === 'words') {
    const words: string[] = []
    for (let i = 0; i < count.value; i++) {
      words.push(randomWord())
    }
    result.value = words.join(' ')
  } else if (mode.value === 'sentences') {
    const sentences: string[] = []
    for (let i = 0; i < count.value; i++) {
      sentences.push(randomSentence())
    }
    result.value = sentences.join(' ')
  } else {
    const paragraphs: string[] = []
    for (let i = 0; i < count.value; i++) {
      paragraphs.push(randomParagraph())
    }
    result.value = paragraphs.join('\n\n')
  }
  const short = result.value.substring(0, 50) + '...'
  historyRef.value?.add(short)
  celebrate()
}
</script>
