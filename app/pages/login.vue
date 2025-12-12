<spec lang="md">
# Login Page

**Purpose**: Supabase 認証の入口。Google OAuth を使用。

**Responsibilities**
- 未ログイン時の認証誘導
- ログイン完了後、`fullpath` クエリまたはトップへリダイレクト

**Data**
- `user`: Supabase ユーザー（auto-import composable）
- `route.query.fullpath`: ログイン前遷移先の保持

**Interactions**
- `signInWithGoogle()` を実行して OAuth フロー開始

**Error Handling**
- 認証エラーは Page Store/プラグイン側で toast と logging（本画面は最小責務）

**i18n**
- ボタン文言は i18n キーへ移行予定（`utils/locales.ts` にキー追加）
</spec>

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
    <button
      class="button"
      @click="signInWithGoogle()"
    >
      Googleアカウントを利用する
    </button>
  </div>
</template>
