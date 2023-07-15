import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      gtagAppName: process.env.GTAG_APP_NAME,
      gtagConfig: process.env.GTAG_CONFIG,
      version: pkg.version,
    },
  },
  modules: [
    [
      '@nuxtjs/i18n',
      {
        locales: [
          { code: 'ja', name: '日本語', iso: 'ja_JP', file: 'ja.json' },
          { code: 'en', name: 'English(US)', iso: 'en-US', file: 'en.json' },
        ],
        defaultLocale: 'ja',
        langDir: 'locales/',
        strategy: 'prefix_except_default', // https://v8.i18n.nuxtjs.org/guide/routing-strategies
        // vueI18n: {
        //   fallbackLocale: 'en' // FIXME: 設定方法変わったっぽい
        // },
        lazy: true,
      },
    ],
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
    },
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'assets/scss/index.scss',
  ],
})
