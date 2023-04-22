import pkg from './package.json'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      gtagAppName: process.env.GTAG_APP_NAME,
      gtagConfig: process.env.GTAG_CONFIG,
      version: pkg.version
    }
  },
  app: {
    head: {
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9966413329461393',
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  css: [
    '@mdi/font/css/materialdesignicons.css',
    'assets/scss/index.scss'
  ]
})
