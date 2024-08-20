export function useUserActions () {
  const { isLogin, userName, userAvatarUrl } = useUserState()

  const fetchUserData = () => {
    const user = useSupabaseUser()

    isLogin.value = !!(user.value)

    userName.value = user.value?.user_metadata?.name
    userAvatarUrl.value = user.value?.user_metadata?.avatar_url
  }

  return {
    fetchUserData,
  }
}
