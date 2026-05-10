<spec lang="md">
# Confirm Page

OAuth コールバック後の認証確認画面。

## Data
- `user`: Supabase ユーザー（auto-import composable）
- `status`: `processing | success | error`

## Interactions
- `user` が取得できたらトップへ遷移
- 一定時間内に完了しない場合は error 表示へ遷移
- エラー時のボタンで login へ戻る

## Features
- 進行状態を i18n 文言で明示表示
- 再試行導線を提供

## i18n
- `auth.confirm.*` キーを利用
</spec>

<script setup lang="ts">
const localePath = useLocalePath()
const user = useSupabaseUser()
const { t } = useI18n()

const status = ref<'processing' | 'success' | 'error'>('processing')
let timeoutId: ReturnType<typeof setTimeout> | null = null

const retryLogin = async () => {
  await navigateTo(localePath('/login'))
}

watch(
  user,
  () => {
    if (user.value) {
      status.value = 'success'
      // Redirect to protected page
      return navigateTo(localePath('/'))
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  timeoutId = setTimeout(() => {
    if (!user.value) {
      status.value = 'error'
    }
  }, 8000)
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <div class="section">
    <div class="notification" :class="status === 'error' ? 'is-danger' : 'is-info'">
      <p v-if="status === 'processing'">
        {{ t(LOCALE_AUTH_CONFIRM_PROCESSING) }}
      </p>
      <p v-else-if="status === 'success'">
        {{ t(LOCALE_AUTH_CONFIRM_SUCCESS) }}
      </p>
      <template v-else>
        <p class="mb-3">
          {{ t(LOCALE_AUTH_CONFIRM_ERROR) }}
        </p>
        <button
          type="button"
          class="button is-light"
          @click="retryLogin"
        >
          {{ t(LOCALE_AUTH_CONFIRM_RETRY) }}
        </button>
      </template>
    </div>
  </div>
</template>
