<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md"
          :class="toastClasses(toast.type)"
        >
          <span class="text-sm font-medium">{{ toast.message }}</span>
          <button class="ml-2 rounded p-0.5 opacity-70 hover:opacity-100" @click="dismiss(toast.id)" aria-label="Dismiss">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])

function add(message: string, type: Toast['type'] = 'info', duration = 4000) {
  const id = crypto.randomUUID()
  toasts.value.push({ id, message, type })
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
}

function dismiss(id: string) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function toastClasses(type: Toast['type']) {
  return {
    success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200',
    error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
    info: 'border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
  }[type]
}

provide('toast', { add })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
