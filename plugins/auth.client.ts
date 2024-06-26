import { useUserStore } from '~/store/user'
import { useUserSettingsStore } from '~/store/data/userSettings'

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore()
  const { isLogin } = storeToRefs(userStore)
  const { fetchUserData } = userStore
  const { fetchUserSettings } = useUserSettingsStore()
  const { $i18n } = useNuxtApp()

  nuxtApp.hook('app:created', () => {
    // ユーザ情報取得
    fetchUserData()
      .then(() => {
        if (isLogin.value) {
          // UserSettings取得
          fetchUserSettings()
        } else {
          // ログイン情報を取得できなかったらトーストを表示
          showWarningToast($i18n.t(LOCALE_ERROR_GET_USER_INFO))
        }
      })
  })
})
