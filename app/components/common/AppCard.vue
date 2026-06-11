<template>
  <div
    class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    :class="[paddingClass, hoverClass]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  padded?: boolean
  hover?: boolean
}>(), {
  padded: true,
  hover: false,
})

const paddingClass = 'p-6'
const hoverClass = 'transition-shadow hover:shadow-md dark:hover:border-gray-700'
</script>
