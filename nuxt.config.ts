// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  // Filled from NUXT_FUNDA_API_KEY at boot, so the build never needs the secret.
  runtimeConfig: {
    fundaApiKey: ''
  },

  // Listings change slowly, so serve cached responses and revalidate behind them.
  routeRules: {
    '/api/listings/*': { swr: 600 }
  },

  vite: {
    optimizeDeps: {
      // MapLibre's worker file breaks Vite's dev pre-bundler.
      exclude: ['maplibre-gl']
    }
  },

  modules: ['@nuxt/eslint']
})
