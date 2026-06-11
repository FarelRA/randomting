<template>
  <Transition name="result">
    <div v-if="visible" class="space-y-4">
      <div class="rounded-xl border bg-gray-50 p-6 dark:bg-gray-800/50" :class="borderClass">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 overflow-auto">
            <slot />
          </div>
          <div class="flex shrink-0 gap-1">
            <CommonCopyButton v-if="copyText" :text="copyText" />
            <CommonAppButton v-if="showConfetti" variant="ghost" size="sm" aria-label="Celebrate" @click="$emit('celebrate')">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.2 15.1l-3.2 3.2a1 1 0 01-1.4-1.4l3.2-3.2" />
                <path d="M6.8 4.8l-3.2 3.2a1 1 0 001.4 1.4l3.2-3.2" />
                <path d="M4.8 6.8l3.2 3.2a1 1 0 001.4-1.4L6.2 5.4" />
                <path d="M19.2 17.2l-3.2 3.2a1 1 0 101.4 1.4l3.2-3.2" />
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
              </svg>
            </CommonAppButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  copyText?: string
  showConfetti?: boolean
  borderClass?: string
}>()

defineEmits<{
  celebrate: []
}>()
</script>

<style scoped>
.result-enter-active {
  transition: all 0.3s ease-out;
}
.result-leave-active {
  transition: all 0.2s ease-in;
}
.result-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.result-leave-to {
  opacity: 0;
}
</style>
