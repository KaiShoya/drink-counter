import { useUserStore } from '@/store/userSettings'

export default defineNuxtPlugin((nuxtApp) => {
  const { setUserSettings, getUser } = useUserStore()
  const { supabase } = useSupabase()
  const { $i18n } = useNuxtApp()

  nuxtApp.hook('app:created', async () => {
    await getUser()

    // ユーザーデータ取得
    const { data: userSettingsData, error: getUserSettingsError } = await useAsyncData(
      'get_user_settings',
      async () => {
        const { data } = await supabase.rpc('get_user_settings')
        return data
      },
    )
    if (getUserSettingsError) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    setUserSettings(userSettingsData)
  })
})
