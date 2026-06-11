<template>
  <CommonAppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <CommonAppInput v-model="startDate" label="Start Date" type="date" />
        <CommonAppInput v-model="endDate" label="End Date" type="date" />
      </div>
      <CommonAppButton @click="generate">
        Generate Random Date
      </CommonAppButton>
    </div>
  </CommonAppCard>

  <ToolsResultDisplay :visible="!!result" :copy-text="result" :show-confetti="true" class="mt-6">
    <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ result }}</p>
  </ToolsResultDisplay>

  <ToolsHistoryPanel ref="historyRef" storage-key="random-date" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

function fmt(d: Date) {
  return d.toISOString().split('T')[0]
}

const startDate = ref('2024-01-01')
const endDate = ref('2025-12-31')
const result = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

function generate() {
  const start = new Date(startDate.value).getTime()
  const end = new Date(endDate.value).getTime()
  const diff = end - start
  const randomTime = start + gen() * diff
  const date = new Date(randomTime)
  result.value = date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
  historyRef.value?.add(result.value)
  celebrate()
}
</script>
