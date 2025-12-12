<script setup lang="ts">
const route = useRoute()
const { signInWithGoogle } = useSupabaseStore()

const localePath = useLocalePath()
const user = useSupabaseUser()
watch(
  user,
  () => {
    if (user.value) {
      const fullpath = route.query.fullpath?.toString() ?? localePath('/')
      return navigateTo(fullpath)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div>
    <!-- <spec>
      title: Login Page
      purpose: Supabase 認証によるログイン入口。Google OAuth を使用。
      responsibilities:
        - 未ログイン時の認証誘導
        - ログイン完了後、`fullpath` クエリまたはトップへリダイレクト
      data:
        - `user`: Supabase ユーザー（auto-import composable）
        - `route.query.fullpath`: ログイン前遷移先の保持
      interactions:
        - `signInWithGoogle()` 実行で OAuth フロー開始
      error-handling:
        - 認証エラーは Page Store/プラグイン側で toast と logging（本画面は最小責務）
      i18n:
        - ボタン文言は将来 i18n キーへ移行（`utils/locales.ts` にキー追加）
    </spec> -->
    <button
      class="button"
      @click="signInWithGoogle()"
    >
      Googleアカウントを利用する
    </button>
  </div>
</template>
