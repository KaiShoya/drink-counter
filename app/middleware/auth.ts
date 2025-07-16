export default defineNuxtRouteMiddleware(async (_to, from) => {
  const localePath = useLocalePath();

  const { fetchUserData } = useUserStore();
  const { isLogin } = storeToRefs(useUserStore());

  try {
    await fetchUserData();
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return navigateTo(localePath("/login"));
  }

  if (!isLogin.value) {
    return navigateTo(
      localePath("/login?fullpath=" + encodeURIComponent(from.fullPath))
    );
  }

  const { fetchUserSettings } = useUserSettingsStore();
  try {
    await fetchUserSettings();
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    // ユーザー設定の取得に失敗してもページアクセスは許可する
  }
});
