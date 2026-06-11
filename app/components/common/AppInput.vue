<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
        class="block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        :class="error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    <p v-if="hint && !error" class="text-sm text-gray-500 dark:text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  hint?: string
  min?: number
  max?: number
  step?: number
}>(), {
  type: 'text',
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = `input-${Math.random().toString(36).slice(2, 9)}`
</script>
