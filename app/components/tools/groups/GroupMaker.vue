<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Names (one per line)</label>
        <textarea v-model="namesText" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana" />
      </div>
      <div class="flex items-center gap-2">
        <CommonAppSelect v-model="mode" :options="modeOptions" label="Mode" />
        <CommonAppInput v-if="mode === 'size'" v-model.number="groupSize" label="Per Group" type="number" :min="1" :max="names.length" />
        <CommonAppInput v-else v-model.number="groupCount" label="Group Count" type="number" :min="1" :max="names.length" />
      </div>
      <CommonAppButton :disabled="names.length === 0" @click="generate">
        Create Groups
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!result" :show-confetti="true" class="mt-6">
    <div class="space-y-4">
      <div v-for="(group, i) in result" :key="i">
        <h4 class="mb-2 font-semibold text-primary-600 dark:text-primary-400">Group {{ i + 1 }} ({{ group.length }})</h4>
        <div class="flex flex-wrap gap-2">
          <span v-for="name in group" :key="name" class="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">{{ name }}</span>
        </div>
      </div>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="group-maker" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const namesText = ref('Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry')
const mode = ref('size')
const groupSize = ref(3)
const groupCount = ref(3)
const result = ref<string[][] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { shuffle } = useSeededRandom()

const modeOptions = [
  { value: 'size', label: 'Items per group' },
  { value: 'count', label: 'Number of groups' },
]

const names = computed(() => namesText.value.split('\n').map(s => s.trim()).filter(Boolean))

function generate() {
  const shuffled = shuffle(names.value)
  let groups: string[][]

  if (mode.value === 'size') {
    groups = []
    for (let i = 0; i < shuffled.length; i += groupSize.value) {
      groups.push(shuffled.slice(i, i + groupSize.value))
    }
  } else {
    groups = Array.from({ length: groupCount.value }, () => [])
    for (let i = 0; i < shuffled.length; i++) {
      groups[i % groupCount.value].push(shuffled[i])
    }
  }

  result.value = groups
  const summary = groups.map((g, i) => `Group ${i + 1}: [${g.join(', ')}]`).join(' | ')
  historyRef.value?.add(summary)
  celebrate()
}
</script>
