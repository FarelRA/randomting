<template>
  <div>
    <h1 class="mb-2 text-center text-2xl font-bold">Create an account</h1>
    <p class="mb-8 text-center text-sm text-gray-600 dark:text-gray-400">Save your presets and history</p>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">{{ error }}</p>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <CommonAppInput v-model="username" label="Username" placeholder="cooluser123" />
      <CommonAppInput v-model="email" label="Email" type="email" placeholder="your@email.com" />
      <CommonAppInput v-model="password" label="Password" type="password" placeholder="********" hint="At least 6 characters" />
      <CommonAppButton type="submit" class="w-full" :disabled="submitting || !username || !email || !password">
        {{ submitting ? 'Creating account...' : 'Create Account' }}
      </CommonAppButton>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Already have an account?
      <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleRegister() {
  submitting.value = true
  error.value = ''
  try {
    await auth.register(username.value, email.value, password.value)
    await navigateTo('/profile')
  } catch (e: any) {
    error.value = e?.data?.message || 'Registration failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
