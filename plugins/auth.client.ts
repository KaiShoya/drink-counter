import { storeToRefs } from 'pinia'
import * as bulmaToast from 'bulma-toast'
import { useUserStore } from '@/store/user'
import { useSupabaseStore } from '@/store/supabase'

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore()
  const { isLogin } = storeToRefs(userStore)
  const { setUserSettings, getUser } = userStore
  const { supabase } = useSupabaseStore()
  const { $i18n } = useNuxtApp()

  nuxtApp.hook('app:created', async () => {
    await getUser()

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
