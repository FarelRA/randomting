<template>
  <AppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppInput v-model="startTime" label="Start Time" type="time" />
        <AppInput v-model="endTime" label="End Time" type="time" />
      </div>
      <AppButton @click="generate">
        Generate Random Time
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="result" :show-confetti="true" class="mt-6">
    <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ result }}</p>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="random-time" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const startTime = ref('09:00')
const endTime = ref('17:00')
const result = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function fromMinutes(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
}

function generate() {
  const start = toMinutes(startTime.value)
  const end = toMinutes(endTime.value)
  const randomMin = Math.floor(start + gen() * (end - start))
  result.value = fromMinutes(randomMin)
  historyRef.value?.add(result.value)
  celebrate()
}
</script>
