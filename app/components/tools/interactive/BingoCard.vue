<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom words (one per line, 24 max)</label>
        <textarea v-model="customWords" rows="4" class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Leave empty for BINGO theme" />
      </div>
      <CommonAppButton @click="generateCard">
        Generate Card{{ cardGenerated ? ' Again' : '' }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay v-if="cardGenerated" :visible="cardGenerated" :copy-text="cardCopyText" :show-confetti="true" class="mt-6">
    <div class="grid grid-cols-5 gap-1 sm:gap-2">
      <div v-for="(cell, i) in cardCells" :key="i"
           class="flex aspect-square items-center justify-center rounded-lg border text-center text-xs font-semibold sm:text-sm"
           :class="cell === 'FREE' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 border-primary-300 dark:border-primary-700' : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'">
        {{ cell }}
      </div>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="bingo-card" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const customWords = ref('')
const cardCells = ref<string[]>([])
const cardGenerated = ref(false)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const defaultWords = ['B', 'I', 'N', 'G', 'O']

const { shuffle, pick } = useSeededRandom()

const cardCopyText = computed(() => cardCells.value.join(', '))

const bingoWordPool: Record<string, string[]> = {
  B: ['Baking', 'Beach', 'Birthday', 'Blue', 'Book', 'Bread', 'Bridge', 'Bubble'],
  I: ['Ice', 'Idea', 'Island', 'Ivy', 'Igloo', 'Image', 'Ink', 'Iron'],
  N: ['Nature', 'Night', 'North', 'Nest', 'Note', 'Noodle', 'Nova', 'Nurse'],
  G: ['Garden', 'Gem', 'Ghost', 'Gift', 'Glass', 'Gold', 'Grape', 'Green'],
  O: ['Ocean', 'Olive', 'Orange', 'Oval', 'Owl', 'Oxygen', 'Oyster', 'Oasis'],
}

function generateCard() {
  const words: string[] = []

  if (customWords.value.trim()) {
    const lines = customWords.value.split('\n').map(l => l.trim()).filter(Boolean)
    const picked = shuffle(lines).slice(0, 24)
    words.push(...picked)
  } else {
    for (const letter of defaultWords) {
      const pool = bingoWordPool[letter]
      const picked = shuffle([...pool]).slice(0, 5)
      words.push(...picked)
    }
  }

  while (words.length < 24) words.push('?')
  const picked = shuffle(words).slice(0, 24)
  picked.splice(12, 0, 'FREE')
  cardCells.value = picked
  cardGenerated.value = true
  historyRef.value?.add(picked.join(', '))
  celebrate()
}
</script>
