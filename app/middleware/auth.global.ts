import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.meta.groups?.includes('protected')) {
    return
  }

  const localePath = useLocalePath();

  const { fetchUserData } = useUserStore();
  const { isLogin } = storeToRefs(useUserStore());

  await fetchUserData();

  if (!isLogin.value) {
    const fullPath = from?.fullPath || '/';
    return navigateTo(localePath("/login?fullpath=" + fullPath));
  }
});
