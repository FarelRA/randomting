<template>
  <AppButton variant="ghost" size="sm" aria-label="Share" @click="share">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  </AppButton>
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string
  title?: string
  url?: string
}>()

async function share() {
  const shareData = {
    title: props.title || 'Randomting',
    text: props.text || 'Check out this random tool!',
    url: props.url || window.location.href,
  }
  if (navigator.share) {
    try { await navigator.share(shareData) } catch {}
  } else {
    await navigator.clipboard.writeText(shareData.url)
  }
}
</script>
