// /// <reference types="node" />
// // https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   compatibilityDate: '2025-07-15',
//   css: ['~/assets/styles/main.css'],
//   runtimeConfig: {
//     public: {
//       apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',

//     },
//   },
// })
/// <reference types="node" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  css: ['~/assets/styles/main.css'],

  ssr: true,

  nitro: {
    preset: 'vercel'
  },

  runtimeConfig: {
    public: {
      // Optional: only needed if you re-enable server API proxy to a real backend.
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '',
    },
  },
})