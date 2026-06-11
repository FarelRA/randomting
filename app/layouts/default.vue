<template>
  <div class="flex min-h-screen flex-col">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white">
      Skip to main content
    </a>

    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold" aria-label="Home">
          <span class="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">randomting</span>
        </NuxtLink>

        <nav class="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <NuxtLink to="/tools" class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Tools
          </NuxtLink>
          <NuxtLink to="/multiplayer" class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Multiplayer
          </NuxtLink>
          <template v-if="auth.isAuthenticated && auth.user">
            <NuxtLink v-if="auth.isAdmin" to="/admin" class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Admin
            </NuxtLink>
            <NuxtLink to="/profile" class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              {{ auth.user.username }}
            </NuxtLink>
            <button class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100" @click="handleLogout">
              Logout
            </button>
          </template>
          <NuxtLink v-else to="/auth/login" class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Login
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <CommonThemeToggle />
          <CommonAppButton variant="primary" size="sm" class="hidden md:inline-flex" to="/tools">
            Get Started
          </CommonAppButton>
          <button class="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-gray-900 md:hidden dark:text-gray-400 dark:hover:text-gray-100" aria-label="Toggle mobile menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 py-8 dark:border-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            &copy; {{ new Date().getFullYear() }} randomting. All random, all the time.
          </p>
          <div class="flex gap-6">
            <NuxtLink to="/tools" class="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Tools
            </NuxtLink>
            <NuxtLink to="/multiplayer" class="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Multiplayer
            </NuxtLink>
            <NuxtLink to="/offline" class="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Offline
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <CommonAppToast />
    <CommonConnectionStatus />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const auth = useAuthStore()

if (import.meta.client) {
  auth.fetchMe()
}

async function handleLogout() {
  await auth.logout()
  await navigateTo('/')
}
</script>
