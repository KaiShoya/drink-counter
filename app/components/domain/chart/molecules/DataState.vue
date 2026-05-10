<spec lang="md">
# DataState
データ画面の Loading / Empty / Error 状態表示を統一するための UI コンポーネント。

## Props
- mode: 'loading' | 'empty' | 'error' - 表示状態
- showAction: boolean - アクションボタン表示可否（デフォルト: true）

## Events
- action: () => void - 再試行やCTAボタン押下時に発火

## Features
- 状態ごとにタイトル・説明文・ボタン文言を i18n キーから切り替える
- loading 時のみボタンを `is-loading` 表示にする
- ボタン非表示を許可し、説明表示専用にも利用できる

## i18n
- 表示文言は `data.state.*` キーを利用する
</spec>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  mode: 'loading' | 'empty' | 'error'
  showAction?: boolean
}>(), {
  showAction: true,
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const { t } = useI18n()

const panelColorClass = computed(() => {
  if (props.mode === 'error') return 'is-danger'
  if (props.mode === 'empty') return 'is-warning'
  return 'is-info'
})

const titleKey = computed(() => {
  if (props.mode === 'error') return LOCALE_DATA_STATE_ERROR_TITLE
  if (props.mode === 'empty') return LOCALE_DATA_STATE_EMPTY_TITLE
  return LOCALE_DATA_STATE_LOADING_TITLE
})

const descriptionKey = computed(() => {
  if (props.mode === 'error') return LOCALE_DATA_STATE_ERROR_DESCRIPTION
  if (props.mode === 'empty') return LOCALE_DATA_STATE_EMPTY_DESCRIPTION
  return LOCALE_DATA_STATE_LOADING_DESCRIPTION
})

const actionKey = computed(() => {
  if (props.mode === 'error') return LOCALE_DATA_STATE_RETRY
  return LOCALE_DATA_STATE_EMPTY_ACTION
})
</script>

<template>
  <section class="section px-0 py-5">
    <div class="notification" :class="panelColorClass">
      <p class="title is-5 mb-2">
        {{ t(titleKey) }}
      </p>
      <p class="subtitle is-6 mb-4">
        {{ t(descriptionKey) }}
      </p>

      <button
        v-if="showAction"
        type="button"
        class="button is-light"
        :class="{ 'is-loading': mode === 'loading' }"
        :disabled="mode === 'loading'"
        @click="emit('action')"
      >
        {{ t(actionKey) }}
      </button>
    </div>
  </section>
</template>