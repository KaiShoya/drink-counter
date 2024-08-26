export default defineNuxtRouteMiddleware((_to, from) => {
  const localePath = useLocalePath()

  const { fetchUserData } = useUserStore()
  const { isLogin } = storeToRefs(useUserStore())

  fetchUserData()

  if (!isLogin.value) {
    const { fetchUserSettings } = useUserSettingsStore()
    fetchUserSettings()
    return navigateTo(localePath('/login?fullpath=' + from.fullPath))
  }
})
