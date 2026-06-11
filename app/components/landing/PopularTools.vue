<template>
  <section class="px-4 pb-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">Popular Tools</h2>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Most used randomizers</p>
        </div>
        <AppButton to="/tools" variant="ghost" size="sm">
          View All &rarr;
        </AppButton>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="tool in popular"
          :key="tool.slug"
          :to="`/tools/${tool.slug}`"
          class="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
        >
          <h3 class="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400">{{ tool.name }}</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ tool.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const popular = [
  { slug: 'random-number', name: 'RNG', description: 'Random number generator' },
  { slug: 'dice-roller', name: 'Dice Roller', description: 'Roll any dice combination' },
  { slug: 'coin-flip', name: 'Coin Flip', description: 'Flip virtual coins' },
  { slug: 'password-generator', name: 'Password Gen', description: 'Secure passwords' },
]
</script>
