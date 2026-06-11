<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="mb-6 h-16 w-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
      <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0122.56 9" />
      <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
      <path d="M8.53 16.11a6 6 0 016.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
    <h1 class="text-2xl font-bold">You&apos;re Offline</h1>
    <p class="mt-2 max-w-md text-gray-600 dark:text-gray-400">
      Don&apos;t worry! Some tools may still work from cache.
      Connect to the internet to access everything.
    </p>
    <div class="mt-8 flex gap-4">
      <CommonAppButton @click="refresh">Try Again</CommonAppButton>
      <CommonAppButton variant="secondary" to="/">Go Home</CommonAppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
function refresh() {
  window.location.reload()
}
</script>
