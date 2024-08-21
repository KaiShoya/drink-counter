export function useUserActions () {
  const { isLogin, userName, userAvatarUrl } = useUserState()

  const fetchUserData = () => {
    try {
      const user = useSupabaseUser()
      isLogin.value = !!(user.value)
      userName.value = user.value?.user_metadata?.name
      userAvatarUrl.value = user.value?.user_metadata?.avatar_url
    } catch (error) {
      isLogin.value = false
      userName.value = null
      userAvatarUrl.value = null
    }
  }

  return {
    fetchUserData,
  }
}
