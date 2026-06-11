<template>
  <div class="flex min-h-screen">
    <aside class="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div class="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800">
        <NuxtLink to="/" class="text-lg font-bold">
          <span class="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">randomting</span>
        </NuxtLink>
        <span class="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">Admin</span>
      </div>
      <nav class="space-y-1 p-4">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100'">
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <div class="ml-64 flex flex-1 flex-col">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-gray-200 bg-white/80 px-8 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <ThemeToggle />
        <NuxtLink to="/profile" class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          A
        </NuxtLink>
      </header>
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: resolveComponent('IconDashboard') },
  { to: '/admin/jokes', label: 'Jokes', icon: resolveComponent('IconSmile') },
  { to: '/admin/facts', label: 'Facts', icon: resolveComponent('IconInfo') },
  { to: '/admin/quotes', label: 'Quotes', icon: resolveComponent('IconQuote') },
  { to: '/admin/users', label: 'Users', icon: resolveComponent('IconUsers') },
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + '/')
}
</script>
