import * as bulmaToast from 'bulma-toast'
import { useUserStore } from '@/store/userSettings'

export default defineNuxtRouteMiddleware(() => {
  // 画面リロード時にdocumentが取得できずにbulma-toastでエラーが発生するためスキップする
  const nuxtApp = useNuxtApp()
  if (!(process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)) {
    return
  }

  const { isLogin } = useUserStore()
  const { $i18n } = useNuxtApp()

  // ログイン情報を取得できなかったらトーストを表示
  // TODO: 画面リロード時にisLoginの取得が間に合っていないためどうにかしたい
  if (!isLogin) {
    bulmaToast.toast({
      message: $i18n.t('error.GET_USER_INFO'),
      duration: 30000,
      type: 'is-warning',
      dismissible: true,
      animate: { in: 'fadeIn', out: 'fadeOut' },
    })
  }
})
