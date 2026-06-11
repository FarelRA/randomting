<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">List 1 (one per line)</label>
          <textarea v-model="list1Text" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Alice&#10;Bob&#10;Charlie" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">List 2 (optional)</label>
          <textarea v-model="list2Text" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Leave empty to pair within List 1" />
        </div>
      </div>
      <CommonAppButton :disabled="list1.length === 0" @click="pair">
        {{ list2.length > 0 ? 'Pair from Both Lists' : 'Pair Within List' }}
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!result" :show-confetti="true" class="mt-6">
    <div class="space-y-3">
      <div v-for="(pair, i) in result" :key="i" class="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
        <span class="font-semibold text-primary-600 dark:text-primary-400">{{ pair[0] }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        <span class="font-semibold text-primary-600 dark:text-primary-400">{{ pair[1] }}</span>
      </div>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="random-pairing" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const list1Text = ref('Alice\nBob\nCharlie\nDiana')
const list2Text = ref('')
const result = ref<string[][] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { shuffle } = useSeededRandom()

const list1 = computed(() => list1Text.value.split('\n').map(s => s.trim()).filter(Boolean))
const list2 = computed(() => list2Text.value.split('\n').map(s => s.trim()).filter(Boolean))

function pair() {
  if (list2.value.length > 0) {
    const shuffled1 = shuffle(list1.value)
    const shuffled2 = shuffle(list2.value)
    const pairs: string[][] = []
    const len = Math.min(shuffled1.length, shuffled2.length)
    for (let i = 0; i < len; i++) {
      pairs.push([shuffled1[i], shuffled2[i]])
    }
    result.value = pairs
    const summary = pairs.map(p => `${p[0]} & ${p[1]}`).join(', ')
    historyRef.value?.add(summary)
  } else {
    const shuffled = shuffle(list1.value)
    const pairs: string[][] = []
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]])
    }
    result.value = pairs
    const summary = pairs.map(p => `${p[0]} & ${p[1]}`).join(', ')
    historyRef.value?.add(summary)
  }
  celebrate()
}
</script>
