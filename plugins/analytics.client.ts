import { defineNuxtPlugin } from '#app'
import VueGtag from 'vue-gtag'

// Nuxtプラグインの登録
export default defineNuxtPlugin((nuxtApp) => {
  // ルーター取得
  const router = useRouter()

  // Vue登録
  nuxtApp.vueApp.use(
    VueGtag,
    {
      appName: useRuntimeConfig().public.gtagAppName,
      pageTrackerScreenviewEnabled: true,
      config: { id: useRuntimeConfig().public.gtagConfig }
    },
    router
  )
})
