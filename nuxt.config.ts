import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  spaLoadingTemplate: true,
  runtimeConfig: {
    public: {
      supabaseUrl: 'http://localhost:54321',
      supabaseKey: '',
      gtagAppName: '',
      gtagConfig: '',
      version: pkg.version,
    },
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],
  app: {
    head: {
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9966413329461393',
          crossorigin: 'anonymous',
        },
      ],
      link: [
        { rel: 'apple-touch-icon', type: 'image/png', href: '/icon.png' },
      ],
    },
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'assets/scss/index.scss',
    'animate.css/animate.min.css',
  ],
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'ja', name: '日本語', iso: 'ja_JP', file: 'ja.yaml' },
      { code: 'en', name: 'English(US)', iso: 'en-US', file: 'en.yaml' },
    ],
    defaultLocale: 'ja',
    langDir: 'locales/',
    strategy: 'prefix_except_default', // https://v8.i18n.nuxtjs.org/guide/routing-strategies
    lazy: true,
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
