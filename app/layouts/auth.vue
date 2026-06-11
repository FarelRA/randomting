<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="text-2xl font-bold">
          <span class="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">randomting</span>
        </NuxtLink>
      </div>
      <AppCard class="p-8">
        <slot />
      </AppCard>
      <p class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <NuxtLink to="/" class="hover:text-primary-600 transition-colors">&larr; Back to home</NuxtLink>
      </p>
    </div>
  </div>
</template>
