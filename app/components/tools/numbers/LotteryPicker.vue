<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-3">
        <CommonAppInput v-model.number="rangeMin" label="From" type="number" :max="rangeMax - 1" />
        <CommonAppInput v-model.number="rangeMax" label="To" type="number" :min="rangeMin + 1" />
        <CommonAppInput v-model.number="pickCount" label="Pick" type="number" :min="1" :max="maxPick" :hint="`1-${maxPick}`" />
      </div>
      <CommonAppButton @click="pick">
        Pick {{ pickCount }} Numbers
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!result" :copy-text="result?.join(', ')" :show-confetti="true" class="mt-6">
    <div class="flex flex-wrap gap-2">
      <span v-for="(num, i) in result" :key="i" class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
        {{ num }}
      </span>
    </div>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="lottery" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const rangeMin = ref(1)
const rangeMax = ref(50)
const pickCount = ref(6)
const result = ref<number[] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { randomInt } = useSeededRandom()

useToolConfig({ rangeMin, rangeMax, pickCount })

const maxPick = computed(() => rangeMax.value - rangeMin.value + 1)

function pick() {
  const pool: number[] = []
  for (let i = rangeMin.value; i <= rangeMax.value; i++) {
    pool.push(i)
  }
  const picked: number[] = []
  const available = [...pool]
  const count = Math.min(pickCount.value, available.length)
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(randomInt(0, available.length - 1))
    picked.push(available[idx])
    available.splice(idx, 1)
  }
  picked.sort((a, b) => a - b)
  result.value = picked
  historyRef.value?.add(picked.join(', '))
  celebrate()
}
</script>
