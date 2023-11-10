import { storeToRefs } from 'pinia'
import * as bulmaToast from 'bulma-toast'
import { useUserStore } from '~/store/user'
import { useUserSettingsStore } from '~/store/data/userSettings'

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore()
  const { isLogin } = storeToRefs(userStore)
  const { fetchUserData } = userStore
  const { fetchUserSettings } = useUserSettingsStore()
  const { $i18n } = useNuxtApp()

  nuxtApp.hook('app:created', async () => {
    // ユーザ情報取得
    await fetchUserData()
    // UserSettings取得
    const error = await fetchUserSettings()
    if (error) {
      showDangerToast($i18n.t('error.500_API_ERROR'))
    }
  })

  // ログイン情報を取得できなかったらトーストを表示
  nuxtApp.hook('page:finish', () => {
    if (!isLogin.value) {
      bulmaToast.toast({
        message: $i18n.t('error.GET_USER_INFO'),
        duration: 30000,
        type: 'is-warning',
        dismissible: true,
        animate: { in: 'fadeIn', out: 'fadeOut' },
      })
    }
  })
})
