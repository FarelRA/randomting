<template>
  <button
    class="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <CommonIconSun v-if="colorMode.value === 'dark'" class="h-5 w-5" />
    <CommonIconMoon v-else class="h-5 w-5" />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
