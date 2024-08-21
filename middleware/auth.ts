export default defineNuxtRouteMiddleware((_to, _from) => {
  const localePath = useLocalePath()

  const { fetchUserData } = useUserStore()
  const { isLogin } = storeToRefs(useUserStore())

  fetchUserData()

  if (!isLogin.value) {
    return navigateTo(localePath('/login'))
  }
})
