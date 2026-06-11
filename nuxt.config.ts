export default defineNuxtConfig({
  compatibilityDate: '2026-06-11',

  devServer: {
    port: 3100,
    host: '0.0.0.0',
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  vite: {
    server: {
      proxy: {
        '/socket.io': {
          target: 'http://localhost:3101',
          ws: true,
        },
      },
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: [
      'pwa-icons/favicon.ico',
      'pwa-icons/apple-touch-icon.png',
    ],
    manifest: {
      name: 'Randomting',
      short_name: 'Randomting',
      description: 'One website, all random tools, no ads, no hopping between sites.',
      theme_color: '#4f46e5',
      background_color: '#0f172a',
      display: 'standalone',
      orientation: 'any',
      start_url: '/',
      scope: '/',
      icons: [
        { src: 'pwa-icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      navigateFallback: '/offline',
    },
    client: {
      installPrompt: true,
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Randomting — Random Tools for Everything',
      meta: [
        { name: 'description', content: 'One website, all random tools, no ads, no hopping between sites.' },
        { name: 'theme-color', content: '#4f46e5' },
        { property: 'og:title', content: 'Randomting — Random Tools for Everything' },
        { property: 'og:description', content: 'One website, all random tools, no ads, no hopping between sites.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://randomting.app' },
        { property: 'og:image', content: '/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Randomting — Random Tools for Everything' },
        { name: 'twitter:description', content: 'One website, all random tools, no ads, no hopping between sites.' },
      ],
      link: [
        { rel: 'canonical', href: 'https://randomting.app' },
      ],
    },
  },
})
