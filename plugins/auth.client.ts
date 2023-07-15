import { useUserStore } from '@/store/userSettings'

export default defineNuxtPlugin((nuxtApp) => {
  const { setUserSettings, setIsLogin } = useUserStore()
  const { supabase } = useSupabase()

  nuxtApp.hook('app:created', async () => {
    // ログインチェック
    const { data: sessionData, error: getSessionError } = await supabase.auth.getSession()
    if (getSessionError) {
      // エラー処理
      return
    }
    setIsLogin(sessionData?.session !== null)

    // ユーザーデータ取得
    const { data: userSettingsData, error: getUserSettingsError } = await supabase.rpc('get_user_settings')
    if (getUserSettingsError) {
      // エラー処理
      return
    }
    setUserSettings(userSettingsData)
  })
})
