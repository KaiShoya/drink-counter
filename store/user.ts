import { useSupabaseStore } from '~/store/supabase'

export const useUserStore = defineStore('user', () => {
  const { supabase } = useSupabaseStore()
  const isLogin = ref<boolean>(false)
  const userName = ref<string | null>(null)
  const userAvatarUrl = ref<string | null>(null)

  /**
   * ログイン済みの場合にユーザ情報とUserSettingsを取得する
   */
  const fetchUserData = async () => {
    // ログインセッションチェック
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      // eslint-disable-next-line no-console
      console.error(sessionError)
      throw new Error(LOCALE_ERROR_500_API_ERROR)
    }
    if (sessionData.session === null) {
      isLogin.value = false
      return
    }

    // ユーザ情報取得
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      // eslint-disable-next-line no-console
      console.error(userError)
      throw new Error(LOCALE_ERROR_500_API_ERROR)
    }

    isLogin.value = userData.user !== null
    userName.value = userData.user?.user_metadata?.name
    userAvatarUrl.value = userData.user?.user_metadata?.avatar_url
  }

  return {
    isLogin,
    userName,
    userAvatarUrl,
    fetchUserData,
  }
})
