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
    '@nuxt/test-utils/module',
  ],
  app: {
    head: {
      script: [
        // FIXME: パフォーマンスが悪いため後で直す
        // {
        //   async: true,
        //   src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9966413329461393',
        //   crossorigin: 'anonymous',
        // },
      ],
      link: [
        { rel: 'apple-touch-icon', type: 'image/png', href: '/icon.png' },
      ],
    },
  },
  css: [
    'bulma/css/bulma.min.css',
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
    storesDirs: ['./store/**'],
  },
})
