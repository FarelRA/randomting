<template>
  <div class="mt-6">
    <AppButton variant="secondary" size="sm" @click="showModal = true">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
      Save Preset
    </AppButton>

    <AppModal :open="showModal" title="Save Preset" @close="showModal = false">
      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">Save the current configuration so you can load it later.</p>
        <AppInput v-model="presetName" label="Preset Name" placeholder="e.g. D&D Dice Set" />
        <p v-if="saveError" class="text-sm text-red-500">{{ saveError }}</p>
        <div class="flex justify-end gap-2">
          <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
          <AppButton :disabled="!presetName.trim()" @click="save">Save</AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  toolSlug: string
  config: Record<string, any>
}>()

const auth = useAuthStore()
const showModal = ref(false)
const presetName = ref('')
const saveError = ref('')

async function save() {
  saveError.value = ''
  const name = presetName.value.trim()
  if (!name) return

  if (auth.isAuthenticated) {
    try {
      await $fetch('/api/presets', {
        method: 'POST',
        body: { name, toolSlug: props.toolSlug, config: props.config },
      })
      showModal.value = false
      presetName.value = ''
    } catch (e: any) {
      saveError.value = e?.data?.message || 'Failed to save preset'
    }
  } else {
    try {
      const existing = JSON.parse(localStorage.getItem('presets') || '[]')
      existing.push({ name, toolSlug: props.toolSlug, config: props.config, createdAt: Date.now() })
      localStorage.setItem('presets', JSON.stringify(existing))
      showModal.value = false
      presetName.value = ''
    } catch {
      saveError.value = 'Failed to save preset'
    }
  }
}
</script>
