<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    class="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-gray-900"
    :class="[
      sizeClasses[size],
      variantClasses[variant],
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  ariaLabel?: string
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
}
</script>
