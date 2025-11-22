export default defineNuxtRouteMiddleware(async (_to, from) => {
  const localePath = useLocalePath();

  const { fetchUserData } = useUserStore();
  const { isLogin } = storeToRefs(useUserStore());

  await fetchUserData();

  if (!isLogin.value) {
    const fullPath = from?.fullPath || '/';
    return navigateTo(localePath("/login?fullpath=" + fullPath));
  }
});
