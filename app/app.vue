<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors',
  },
})

useSeoMeta({
  title: 'Randomting — Random Tools for Everything',
  ogTitle: 'Randomting — Random Tools for Everything',
  description: 'One website, all random tools, no ads, no hopping between sites.',
  ogDescription: 'One website, all random tools, no ads, no hopping between sites.',
  ogType: 'website',
  ogUrl: 'https://randomting.app',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Randomting — Random Tools for Everything',
  twitterDescription: 'One website, all random tools, no ads, no hopping between sites.',
})

const { isOnline, isInstallable, updateAvailable, install } = useAppPWA()

provide('pwa', { isOnline, isInstallable, updateAvailable, install })
</script>
