<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Options (one per line)</label>
        <textarea v-model="optionsText" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Option A&#10;Option B&#10;Option C" />
      </div>
      <CommonAppButton :disabled="options.length < 2" @click="decide">
        Decide!
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!result" :copy-text="result" :show-confetti="true" class="mt-6">
    <div class="text-center">
      <p class="mb-2 text-lg text-gray-500 dark:text-gray-400">The decision is...</p>
      <p class="text-3xl font-bold text-primary-600 dark:text-primary-400">{{ result }}</p>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="decision-maker" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const optionsText = ref('Go out\nStay in\nOrder pizza\nCook dinner')
const result = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

const options = computed(() => optionsText.value.split('\n').map(s => s.trim()).filter(Boolean))

function decide() {
  const idx = Math.floor(gen() * options.value.length)
  result.value = options.value[idx]
  historyRef.value?.add(result.value)
  celebrate()
}
</script>
