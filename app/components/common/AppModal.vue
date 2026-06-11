<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" ref="backdropRef" class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" :aria-label="title || 'Dialog'" aria-modal="true" @keydown.esc="close">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
        <div ref="panelRef" class="relative z-10 w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold" id="modal-title">{{ title }}</h2>
            <button class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300" @click="close" aria-label="Close dialog">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const backdropRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

function close() {
  emit('close')
}

function getFocusableElements(el: HTMLElement): HTMLElement[] {
  const selectors = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  return Array.from(el.querySelectorAll<HTMLElement>(selectors))
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !panelRef.value) return
  const focusable = getFocusableElements(panelRef.value)
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(() => props.open, (val) => {
  if (val) {
    previousFocus = document.activeElement as HTMLElement
    nextTick(() => {
      const focusable = panelRef.value ? getFocusableElements(panelRef.value) : []
      if (focusable.length > 0) {
        focusable[0].focus()
      }
      document.addEventListener('keydown', trapFocus)
    })
  } else {
    document.removeEventListener('keydown', trapFocus)
    if (previousFocus) {
      previousFocus.focus()
      previousFocus = null
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
