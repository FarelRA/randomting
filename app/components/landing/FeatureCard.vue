<template>
  <div class="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
      <component :is="icon" class="h-6 w-6" />
    </div>
    <h3 class="mb-2 text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-400">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: object
  title: string
  description: string
}>()
</script>
