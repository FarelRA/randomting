<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <ToolHeader :name="name" :description="description" />
    <slot />
    <div v-if="route.params.slug" class="mt-6">
      <PresetManager :tool-slug="route.params.slug as string" :config="toolConfig" />
    </div>
    <ConfettiEffect :active="showConfetti" :duration="4000" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

defineProps<{
  name: string
  description: string
}>()

const toolConfig = inject('toolConfig', ref({}))
const showConfetti = ref(false)

function celebrate() {
  showConfetti.value = true
  setTimeout(() => { showConfetti.value = false }, 4000)
}

provide('celebrate', celebrate)
provide('toolConfig', toolConfig)
</script>
