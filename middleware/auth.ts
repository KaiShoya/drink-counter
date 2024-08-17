export default defineNuxtRouteMiddleware((_to, _from) => {
  const { $i18n } = useNuxtApp()
  const session = useSupabaseSession()
  const user = useSupabaseUser()

  const { fetchUserData } = useUserStore()

  if (!session.value || !user.value) {
    showWarningToast($i18n.t(LOCALE_ERROR_GET_USER_INFO))
    return navigateTo('/login')
  }

  fetchUserData()
})
