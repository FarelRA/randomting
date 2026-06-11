import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function fetchMe() {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data as User
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
    await fetchMe()
  }

  async function register(username: string, email: string, password: string) {
    const data = await $fetch('/api/auth/register', { method: 'POST', body: { username, email, password } })
    user.value = data as User
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, loading, isAuthenticated, isAdmin, fetchMe, login, register, logout }
})
