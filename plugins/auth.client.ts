import { useUserStore } from '@/store/userSettings'

export default defineNuxtPlugin((nuxtApp) => {
  const { setUserSettings, setIsLogin } = useUserStore()
  const { supabase } = useSupabase()
  const { $i18n } = useNuxtApp()

  nuxtApp.hook('app:created', async () => {
    // ログインチェック
    const { data: sessionData, error: sessionError } = await useAsyncData(
      'getSession',
      () => supabase.auth.getSession(),
    )
    if (sessionError.value) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    setIsLogin(sessionData.value?.data.session !== null)

    // ユーザーデータ取得
    // TODO: rpcの戻り値PostgrestFilterBuilderをuseAsyncDataで使う方法がわからないため、一旦このままで。
    const { data: userSettingsData, error: getUserSettingsError } = await supabase.rpc('get_user_settings')
    if (getUserSettingsError) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    setUserSettings(userSettingsData)
  })
})
