import { storeToRefs } from 'pinia'
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
      showDangerToast($i18n.t(error))
    }
  })

  // ログイン情報を取得できなかったらトーストを表示
  nuxtApp.hook('page:finish', () => {
    if (!isLogin.value) {
      showWarningToast($i18n.t(LOCALE_ERROR_GET_USER_INFO))
    }
  })
})
