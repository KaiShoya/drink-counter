<spec lang="md">
# Login Page

Supabase 認証の入口。Google OAuth を使用。

## Data
- `user`: Supabase ユーザー（auto-import composable）
- `isInitialized`: ユーザーストアの認証チェック完了フラグ
- `route.query.fullpath`: ログイン前の遷移先

## Interactions
- ボタンクリックで `signInWithGoogle()` を実行して OAuth フロー開始

## Features
- `isInitialized` と `user` を watch（`immediate: true`）
- 認証チェック完了後にログイン済みなら自動リダイレクト
- リダイレクト先は `fullpath` があればそれを優先、なければトップ
- 認証チェック中は何も表示しない（`v-if="isInitialized"`）

## Error Handling
- 認証エラーの通知/ログは Store/プラグイン側で実施（画面は最小責務）

## i18n
- ボタン文言は `auth.google` キーを使用
</spec>

<script setup lang="ts">
import { useSupabaseStore } from '~/stores/supabase'
import { LOCALE_AUTH_GOOGLE } from '~/utils/locales'

const { t } = useI18n()
const route = useRoute()
const { signInWithGoogle } = useSupabaseStore()
const { isInitialized } = storeToRefs(useUserStore())

const localePath = useLocalePath()
const user = useSupabaseUser()

// 認証チェック完了後に、ログイン状態に基づいてリダイレクト
watch(
  [user, isInitialized],
  ([userData, initialized]) => {
    // 認証チェックが完了していない場合は何もしない
    if (!initialized) return

    // ログイン済みならリダイレクト
    if (userData) {
      const fullpath = route.query.fullpath?.toString() ?? localePath('/')
      const safeFullpath = (
        fullpath.startsWith('/') &&
        !fullpath.startsWith('//') &&
        !fullpath.includes('://')
      )
        ? fullpath
        : localePath('/')

      return navigateTo(safeFullpath)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div v-if="isInitialized">
    <button
      class="button"
      @click="signInWithGoogle()"
    >
      {{ t(LOCALE_AUTH_GOOGLE) }}
    </button>
  </div>
</template>
