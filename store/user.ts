import { useSupabaseStore } from '~/store/supabase'

export const useUserStore = defineStore('user', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const isLogin = ref<boolean>(false)
  const userName = ref<string | null>(null)
  const userAvatarUrl = ref<string | null>(null)

  /**
   * ログイン済みの場合にユーザ情報とUserSettingsを取得する
   */
  const fetchUserData = async () => {
    // ログインセッションチェック
    const { data: sessionData, error: sessionError } = await useAsyncData(
      'getSession',
      () => supabase.auth.getSession(),
    )
    if (sessionError.value) {
      showDangerToast($i18n.t('error.500_API_ERROR'))
      return
    }
    if (sessionData.value?.data.session === null || sessionData.value?.data.session === undefined) {
      isLogin.value = false
      return
    }

    // ユーザ情報取得
    const { data: userData, error: userError } = await useAsyncData(
      'getUser',
      () => supabase.auth.getUser(),
    )
    if (userError.value) {
      showDangerToast($i18n.t('error.500_API_ERROR'))
      return
    }

    isLogin.value = userData.value?.data?.user !== null
    userName.value = userData.value?.data?.user?.user_metadata?.name
    userAvatarUrl.value = userData.value?.data?.user?.user_metadata?.avatar_url
  }

  return {
    isLogin,
    userName,
    userAvatarUrl,
    fetchUserData,
  }
})
