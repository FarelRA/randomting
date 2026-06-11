<template>
  <AppCard>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Names (one per line)</label>
        <textarea v-model="namesText" rows="6" class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Alice&#10;Bob&#10;Charlie" />
      </div>
      <div class="flex items-center gap-4">
        <AppInput v-model.number="pickCount" label="Pick Count" type="number" :min="1" :max="maxPick" hint="0 = pick all" />
      </div>
      <AppButton :disabled="names.length === 0" @click="pick">
        Pick {{ pickCount || 'All' }}
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="result?.join(', ')" :show-confetti="true" class="mt-6">
    <div class="space-y-2">
      <div v-for="(name, i) in result" :key="i" class="rounded-lg bg-primary-50 px-4 py-2 text-lg font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
        {{ name }}
      </div>
    </div>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="name-picker" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const namesText = ref('')
const pickCount = ref(1)
const result = ref<string[] | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { shuffle } = useSeededRandom()

const names = computed(() => namesText.value.split('\n').map(s => s.trim()).filter(Boolean))

const maxPick = computed(() => names.value.length)

function pick() {
  const count = pickCount.value || names.value.length
  const picked = shuffle(names.value).slice(0, count)
  result.value = picked
  historyRef.value?.add(picked.join(', '))
  celebrate()
}
</script>
