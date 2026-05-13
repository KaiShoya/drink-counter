import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath();
  const { fetchUserData } = useUserStore();
  const { isLogin, isInitialized } = storeToRefs(useUserStore());

  // 認証状態がまだ確認されていなければ、確認を実行
  if (!isInitialized.value) {
    await fetchUserData();
  }

  // ログイン画面へのアクセスをチェック
  if (to.path === localePath('/login') || to.path === '/login') {
    // ログイン済みならホームページにリダイレクト
    if (isLogin.value) {
      return navigateTo(localePath('/'));
    }
    // ログインしていなければ、ログイン画面へのアクセスは許可
    return;
  }

  // protected グループのルートには認証が必要
  if (to.meta.groups?.includes('protected')) {
    if (!isLogin.value) {
      return navigateTo(localePath({
        path: '/login',
        query: { fullpath: to.fullPath || '/' },
      }));
    }
  }
});
