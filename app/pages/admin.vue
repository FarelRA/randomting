<template>
  <div>
    <h1 class="text-3xl font-bold">Admin Dashboard</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-400">Manage content and users</p>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="card in adminCards" :key="card.title" :to="card.to" class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <h3 class="font-semibold">{{ card.title }}</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ card.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const adminCards = [
  { title: 'Jokes', description: 'Manage joke content', to: '/admin/jokes' },
  { title: 'Facts', description: 'Manage fact content', to: '/admin/facts' },
  { title: 'Quotes', description: 'Manage quote content', to: '/admin/quotes' },
]
</script>
