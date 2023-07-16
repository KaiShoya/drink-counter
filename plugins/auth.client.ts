import { useUserStore } from '@/store/userSettings'

export default defineNuxtPlugin((nuxtApp) => {
  const { setUserSettings, setIsLogin } = useUserStore()
  const { supabase } = useSupabase()

  nuxtApp.hook('app:created', async () => {
    // ログインチェック
    const { data: sessionData, error: sessionError } = await useAsyncData(
      'getSession',
      () => supabase.auth.getSession(),
    )
    if (sessionError.value) {
      // エラー処理
      return
    }
    setIsLogin(sessionData.value?.data.session !== null)

    // ユーザーデータ取得
    // TODO: rpcの戻り値PostgrestFilterBuilderをuseAsyncDataで使う方法がわからないため、一旦このままで。
    const { data: userSettingsData, error: getUserSettingsError } = await supabase.rpc('get_user_settings')
    if (getUserSettingsError) {
      // エラー処理
      return
    }
    setUserSettings(userSettingsData)
  })
})
