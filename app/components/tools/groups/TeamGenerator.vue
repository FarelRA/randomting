<template>
  <AppCard>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Names (one per line)</label>
        <textarea v-model="namesText" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana" />
      </div>
      <AppInput v-model.number="teamCount" label="Number of Teams" type="number" :min="2" :max="20" hint="2-20" />
      <AppButton :disabled="names.length < teamCount" @click="generate">
        Split into {{ teamCount }} Teams
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :show-confetti="true" class="mt-6">
    <div class="space-y-4">
      <div v-for="(team, i) in result" :key="i">
        <h4 class="mb-2 font-semibold text-primary-600 dark:text-primary-400">Team {{ i + 1 }} ({{ team.length }})</h4>
        <div class="flex flex-wrap gap-2">
          <span v-for="name in team" :key="name" class="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">{{ name }}</span>
        </div>
      </div>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="team-generator" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const namesText = ref('Alice\nBob\nCharlie\nDiana\nEve\nFrank')
const teamCount = ref(2)
const result = ref<string[][] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { shuffle } = useSeededRandom()

const names = computed(() => namesText.value.split('\n').map(s => s.trim()).filter(Boolean))

function generate() {
  const shuffled = shuffle(names.value)
  const teams: string[][] = Array.from({ length: teamCount.value }, () => [])
  for (let i = 0; i < shuffled.length; i++) {
    teams[i % teamCount.value].push(shuffled[i])
  }
  result.value = teams
  const summary = teams.map((t, i) => `Team ${i + 1}: [${t.join(', ')}]`).join(' | ')
  historyRef.value?.add(summary)
  celebrate()
}
</script>
