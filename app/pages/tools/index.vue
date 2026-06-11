<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">All Tools</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Browse and search through all available random tools</p>
    </div>

    <div class="mb-8 flex flex-col gap-4 sm:flex-row">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="search" type="text" placeholder="Search tools..." class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      </div>
    </div>

    <div v-for="cat in filteredCategories" :key="cat.name" class="mb-12">
      <h2 class="mb-4 text-xl font-bold">{{ cat.name }}</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="tool in cat.tools"
          :key="tool.slug"
          :to="`/tools/${tool.slug}`"
          class="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
        >
          <h3 class="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400">{{ tool.name }}</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ tool.description }}</p>
        </NuxtLink>
      </div>
    </div>

    <div v-if="filteredCategories.length === 0" class="py-20 text-center">
      <p class="text-gray-500 dark:text-gray-400">No tools found. Try a different search term.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const search = ref('')

const filteredCategories = computed(() => {
  if (!search.value) return categories
  const q = search.value.toLowerCase()
  return categories
    .map(cat => ({
      ...cat,
      tools: cat.tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
    }))
    .filter(cat => cat.tools.length > 0)
})
</script>
