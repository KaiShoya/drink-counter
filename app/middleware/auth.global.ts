import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const localePath = useLocalePath();
  const { fetchUserData } = useUserStore();
  const { isLogin, isInitialized } = storeToRefs(useUserStore());
  const user = useSupabaseUser();

  // 認証状態がまだ確認されていなければ、確認を実行
  // OAuth 復帰直後など、Store が未ログインのまま stale な場合も再同期する
  if (!isInitialized.value || (!isLogin.value && !!user.value)) {
    await fetchUserData();
  }

  // ログイン画面へのアクセスをチェック
  if (to.path === localePath('/login') || to.path === '/login') {
    // ログイン済みなら指定された遷移先を優先し、なければホームへ
    if (isLogin.value) {
      const fullpathQuery = Array.isArray(to.query.fullpath)
        ? to.query.fullpath[0]
        : to.query.fullpath;
      if (typeof fullpathQuery === 'string' && fullpathQuery.startsWith('/') && !fullpathQuery.startsWith('//')) {
        return navigateTo(fullpathQuery);
      }
      return navigateTo(localePath('/'));
    }
    // ログインしていなければ、ログイン画面へのアクセスは許可
    return;
  }

  // protected グループのルートには認証が必要
  if (to.meta.groups?.includes('protected')) {
    if (!isLogin.value) {
      const fullPath = to.fullPath || '/'
      return navigateTo(localePath({
        path: '/login',
        query: { fullpath: fullPath },
      }));
    }
  }
});
