<spec lang="md">
# Login Page

Supabase 認証の入口。Google OAuth を使用。

## Data
- `user`: Supabase ユーザー（auto-import composable）
- `route.query.fullpath`: ログイン前の遷移先

## Interactions
- ボタンクリックで `signInWithGoogle()` を実行して OAuth フロー開始

## Features
- `user` を watch（`immediate: true`）し、ログイン済みなら自動リダイレクト
- リダイレクト先は `fullpath` があればそれを優先、なければトップ

## Error Handling
- 認証エラーの通知/ログは Store/プラグイン側で実施（画面は最小責務）

## i18n
- ボタン文言は `auth.google` キーを使用
</spec>

<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase'

const { t } = useI18n()
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
      {{ t(LOCALE_AUTH_GOOGLE) }}
    </button>
  </div>
</template>
