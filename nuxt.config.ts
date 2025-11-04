import { defineNuxtConfig } from 'nuxt/config'
import pkg from "./package.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "@nuxt/icon",
    "@nuxtjs/supabase",
    "@nuxt/eslint",
    "nuxt-gtag",
  ],

  ssr: true,

  app: {
    head: {
      title: pkg.title,
      htmlAttrs: {
        lang: "ja",
        prefix: "og: http://ogp.me/ns#",
      },
      script: [
        // FIXME: パフォーマンスが悪いため後で直す
        // {
        //   async: true,
        //   src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9966413329461393',
        //   crossorigin: 'anonymous',
        // },
      ],
      link: [{ rel: "apple-touch-icon", type: "image/png", href: "/icon.png" }],
      meta: [
        { name: "description", content: pkg.description },
        { name: "application-name", content: pkg.title },
        { name: "apple-mobile-web-app-title", content: pkg.title },
        { property: "og:url", content: pkg.url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: pkg.title },
        { property: "og:image", content: `${pkg.url}/icon.png` },
        { property: "og:title", content: pkg.title },
        { property: "og:description", content: pkg.description },
      ],
    },
  },

  css: ["assets/scss/index.scss", "animate.css/animate.min.css"],

  spaLoadingTemplate: true,

  runtimeConfig: {
    public: {
      baseUrl: "http://localhost:3000",
      supabaseUrl: "http://localhost:54321",
      supabaseKey: "",
      version: pkg.version,
    },
  },

  routeRules: {
    "/confirm": { prerender: false },
  },

  compatibilityDate: "2025-03-16",

  eslint: {
    checker: true,
    config: {
      stylistic: {
        indent: 2,
        quotes: "single",
        semi: false,
      },
    },
  },

  gtag: {
    enabled: process.env.NODE_ENV === "production",
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: [
      { code: "ja", name: "日本語", file: "ja.yaml" },
      { code: "en", name: "English(US)", file: "en.yaml" },
    ],
    defaultLocale: "ja",
    langDir: "locales/",
    strategy: "prefix_except_default", // https://v8.i18n.nuxtjs.org/guide/routing-strategies
  },

  pinia: {
    storesDirs: ["./store/**"],
  },

  supabase: {
    redirect: false,
  },

  vite: {
    plugins: [
      {
        name: "vue-spec-plugin",
        transform (_, id) {
          if (/vue&type=spec/.test(id)) {
            return ''
            // return `export default {}`;
          }
          return;
        },
      },
    ],
  },
});
