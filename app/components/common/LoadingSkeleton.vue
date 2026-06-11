<template>
  <div class="animate-pulse space-y-3" :class="$attrs.class || ''">
    <div v-for="i in lines" :key="i" class="h-4 rounded bg-gray-200 dark:bg-gray-700" :style="{ width: widths[i - 1] || '100%' }" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  lines?: number
  widths?: string[]
}>(), {
  lines: 3,
  widths: () => ['100%', '80%', '60%'],
})
</script>
