<template>
  <AppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppInput v-model.number="min" label="Min" type="number" :min="-999999" :max="max" />
        <AppInput v-model.number="max" label="Max" type="number" :min="min" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="flex items-center gap-2">
          <input id="allowDecimals" v-model="decimals" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600">
          <label for="allowDecimals" class="text-sm text-gray-700 dark:text-gray-300">Allow decimals</label>
        </div>
        <AppInput v-model.number="count" label="Count" type="number" :min="1" :max="1000" hint="1-1000" />
      </div>
      <AppButton @click="generate">
        Generate{{ count > 1 ? ' ' + count + ' Numbers' : '' }}
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="result?.join(', ')" :show-confetti="true" class="mt-6">
    <div class="space-y-1">
      <p v-for="(num, i) in result" :key="i" class="text-2xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
        {{ num }}
      </p>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="random-number" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const min = ref(1)
const max = ref(100)
const decimals = ref(false)
const count = ref(1)
const result = ref<(number | string)[] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

useToolConfig({ min, max, decimals, count })

function generate() {
  const nums: (number | string)[] = []
  for (let i = 0; i < count.value; i++) {
    if (decimals.value) {
      nums.push(parseFloat((gen() * (max.value - min.value) + min.value).toFixed(4)))
    } else {
      nums.push(Math.floor(gen() * (max.value - min.value + 1)) + min.value)
    }
  }
  result.value = nums
  historyRef.value?.add(nums.join(', '))
  celebrate()
}
</script>
