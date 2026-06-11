<template>
  <AppCard>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Participants (one per line)</label>
        <textarea v-model="namesText" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Player 1&#10;Player 2&#10;Player 3&#10;Player 4" />
      </div>
      <AppButton :disabled="names.length < 2" @click="generate">
        Generate Bracket
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :show-confetti="true" class="mt-6">
    <div class="space-y-6">
      <div v-for="(round, ri) in result" :key="ri">
        <h4 class="mb-3 font-semibold text-gray-500 dark:text-gray-400">Round {{ ri + 1 }}</h4>
        <div class="grid gap-3" :class="round.length > 4 ? 'sm:grid-cols-2' : ''">
          <div v-for="(match, mi) in round" :key="mi" class="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
            <span class="flex-1 font-medium">{{ match[0] }}</span>
            <span class="text-sm text-gray-400">vs</span>
            <span class="flex-1 font-medium text-right">{{ match[1] }}</span>
          </div>
        </div>
      </div>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="tournament-seeding" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const namesText = ref('Player 1\nPlayer 2\nPlayer 3\nPlayer 4\nPlayer 5\nPlayer 6\nPlayer 7\nPlayer 8')
const result = ref<string[][][] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { shuffle } = useSeededRandom()

const names = computed(() => namesText.value.split('\n').map(s => s.trim()).filter(Boolean))

function generate() {
  const shuffled = shuffle(names.value)
  const brackets: string[][][] = []
  let round: string[][] = []
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    round.push([shuffled[i], shuffled[i + 1]])
  }
  if (shuffled.length % 2 === 1) {
    round.push([shuffled[shuffled.length - 1], 'Bye'])
  }
  brackets.push(round)

  while (round.length > 1) {
    const nextRound: string[][] = []
    for (let i = 0; i < round.length - 1; i += 2) {
      nextRound.push(['TBD', 'TBD'])
    }
    if (round.length % 2 === 1) {
      nextRound.push(['TBD', 'TBD'])
    }
    round = nextRound
    brackets.push(round)
  }

  result.value = brackets
  const summary = shuffled.join(', ')
  historyRef.value?.add(summary)
  celebrate()
}
</script>
