<template>
  <AppCard>
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppInput v-model.number="length" label="Length" type="number" :min="4" :max="128" hint="4-128" />
      </div>
      <div class="space-y-2">
        <label class="flex items-center gap-2">
          <input v-model="useUppercase" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600">
          <span class="text-sm text-gray-700 dark:text-gray-300">Uppercase (A-Z)</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="useLowercase" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600">
          <span class="text-sm text-gray-700 dark:text-gray-300">Lowercase (a-z)</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="useNumbers" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600">
          <span class="text-sm text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="useSymbols" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600">
          <span class="text-sm text-gray-700 dark:text-gray-300">Symbols (!@#$%^&*)</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="excludeAmbiguous" type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600">
          <span class="text-sm text-gray-700 dark:text-gray-300">Exclude ambiguous (il1Lo0O)</span>
        </label>
      </div>
      <AppButton :disabled="!hasCharType" @click="generate">
        Generate Password
      </AppButton>
    </div>
  </AppCard>

  <ResultDisplay :visible="!!result" :copy-text="result" :show-confetti="true" class="mt-6">
    <p class="break-all font-mono text-2xl font-bold tracking-wider text-primary-600 dark:text-primary-400">{{ result }}</p>
  </ResultDisplay>

  <HistoryPanel ref="historyRef" storage-key="password-generator" />
</template>

<script setup lang="ts">
const celebrate = inject('celebrate') as () => void

const length = ref(16)
const useUppercase = ref(true)
const useLowercase = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const excludeAmbiguous = ref(true)
const result = ref<string | null>(null)
const historyRef = ref<InstanceType<typeof HistoryPanel> | null>(null)

const { gen } = useSeededRandom()

useToolConfig({ length, useUppercase, useLowercase, useNumbers, useSymbols, excludeAmbiguous })

const hasCharType = computed(() => useUppercase.value || useLowercase.value || useNumbers.value || useSymbols.value)

function getChars(): string {
  let chars = ''
  if (useUppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (useLowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (useNumbers.value) chars += '0123456789'
  if (useSymbols.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  if (excludeAmbiguous.value) {
    chars = chars.replace(/[il1Lo0O]/g, '')
  }
  return chars
}

function generate() {
  const chars = getChars()
  if (!chars) return
  let password = ''
  for (let i = 0; i < length.value; i++) {
    password += chars[Math.floor(gen() * chars.length)]
  }
  result.value = password
  historyRef.value?.add(password)
  celebrate()
}
</script>
