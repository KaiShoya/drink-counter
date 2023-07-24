import * as bulmaToast from 'bulma-toast'
import { useUserStore } from '@/store/userSettings'
import { useSupabaseStore } from '@/store/supabase'

export default defineNuxtPlugin((nuxtApp) => {
  const { setUserSettings, getUser } = useUserStore()
  const { supabase } = useSupabaseStore()
  const { $i18n } = useNuxtApp()
  let isLogin = false

  nuxtApp.hook('app:created', async () => {
    isLogin = await getUser()

    // ユーザーデータ取得
    const { data: userSettingsData, error: getUserSettingsError } = await useAsyncData(
      'get_user_settings',
      async () => {
        const { data, error } = await supabase.rpc('get_user_settings')
        return { data, error }
      },
    )
    if (getUserSettingsError.value) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    setUserSettings(userSettingsData)
  })

  // ログイン情報を取得できなかったらトーストを表示
  nuxtApp.hook('page:finish', () => {
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
})
