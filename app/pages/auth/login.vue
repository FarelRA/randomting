<template>
  <div>
    <h1 class="mb-2 text-center text-2xl font-bold">Welcome back</h1>
    <p class="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">{{ error }}</p>

    <form class="space-y-4" @submit.prevent="handleLogin">
      <AppInput v-model="email" label="Email" type="email" placeholder="your@email.com" />
      <AppInput v-model="password" label="Password" type="password" placeholder="********" />
      <AppButton type="submit" class="w-full" :disabled="submitting || !email || !password">
        {{ submitting ? 'Signing in...' : 'Sign In' }}
      </AppButton>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Don&apos;t have an account?
      <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Register</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleLogin() {
  submitting.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    await navigateTo('/profile')
  } catch (e: any) {
    error.value = e?.data?.message || 'Login failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
