// https://v8.i18n.nuxtjs.org/guide/extend-messages/
import { createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  // eslint-disable-next-line space-before-function-paren
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('i18n:registerModule', (register) => {
      register({
        // langDir path needs to be resolved
        langDir: resolve('./'),
        locales: [
          { code: 'ja', name: '日本語', iso: 'ja_JP', file: 'ja.json' },
          { code: 'en', name: 'English(US)', iso: 'en-US', file: 'en.json' }
        ]
        // defaultLocale: 'ja',
        // langDir: 'locales/',
        // strategy: 'prefix_except_default', // https://v8.i18n.nuxtjs.org/guide/routing-strategies
        // // vueI18n: {
        // //   fallbackLocale: 'en' // FIXME: 設定方法変わったっぽい
        // // },
        // lazy: true
      })
    })
  }
})
