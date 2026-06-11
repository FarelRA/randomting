<template>
  <section class="px-4 py-20 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold">All Tools by Category</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Every randomizer you&apos;ll ever need</p>
      </div>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.name"
          :to="`/tools?category=${cat.slug}`"
          class="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-800"
        >
          <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
            <component :is="catIconMap[cat.slug]" class="h-5 w-5" />
          </div>
          <h3 class="mb-1 font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400">{{ cat.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ cat.toolCount }} tools</p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const catIconMap: Record<string, any> = {
  numbers: resolveComponent('IconNumbers'),
  pickers: resolveComponent('IconPickers'),
  groups: resolveComponent('IconGroups'),
  strings: resolveComponent('IconStrings'),
  visual: resolveComponent('IconVisual'),
  fun: resolveComponent('IconFun'),
  interactive: resolveComponent('IconInteractive'),
  multiplayer: resolveComponent('IconMultiplayer'),
}
</script>
