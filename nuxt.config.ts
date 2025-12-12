// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit';
const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  ssr: true,
  srcDir: 'src/',

  imports: {
    dirs: ['constants', 'composables'],
  },

  app: {
    head: {
      link: [
        // { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // Add fallbacks for older browsers
        // { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png' }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Motobike Tours' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
    baseURL: '/',
  },

  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@element-plus/nuxt',
    '@unocss/nuxt',
    '@vue-macros/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/i18n',
    'nuxt-api-party',
    '@nuxt/image',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  i18n: {
    defaultLocale: 'vi',
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
    ],
  },
  apiParty: {
    endpoints: {
      motobikertoursApi: {
        url: 'https://motobikertours-api.vercel.app', // process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
        schema: resolve('./src/schemas/motobikertoursApi.json'),
      },
    },
  },

  site: {
    url: 'https://motobiketours.vercel.app/',
  },
  sitemap: {},

  css: ['@unocss/reset/tailwind.css', 'boxicons/css/boxicons.min.css'],

  compatibilityDate: '2025-04-15',
  runtimeConfig: {
    // client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
