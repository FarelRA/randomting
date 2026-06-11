<template>
  <div class="space-y-1">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  options: { value: string; label: string }[]
}>(), {
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = `select-${Math.random().toString(36).slice(2, 9)}`
</script>
