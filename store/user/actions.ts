export function useUserActions () {
  const { isLogin, userName, userAvatarUrl, accessToken, refreshToken } = useUserState()

  const fetchUserData = () => {
    try {
      const user = useSupabaseUser()
      isLogin.value = !!(user.value)
      userName.value = user.value?.user_metadata?.name
      userAvatarUrl.value = user.value?.user_metadata?.avatar_url

      const session = useSupabaseSession()
      accessToken.value = session.value?.access_token ?? null
      refreshToken.value = session.value?.refresh_token ?? null
    } catch {
      isLogin.value = false
      userName.value = null
      userAvatarUrl.value = null
    }
  }

  return {
    fetchUserData,
  }
}
