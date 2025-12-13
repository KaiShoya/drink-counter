<spec lang="md">
# ThemeButton

テーマ切り替えボタン。ライトモードとダークモードを切り替える。

## Props
- themePreference: ThemeClass - 現在のテーマ設定（'theme-light' | 'theme-dark'）
- resolvedTheme: ThemeClass - 解決済みのテーマクラス（'theme-light' | 'theme-dark'）
- changeTheme: (theme: ThemeClass) => void - テーマ変更関数
- labels: { light: string, dark: string } - ラベルオブジェクト

## Events
- なし（emitなし）

## Features
- クリックでライト/ダークを切り替え
- アイコンは現在のテーマに応じて変化（sun/moon）
- 色もテーマに応じて変化
- アクセシビリティ対応（aria-label/title）

## Accessibility
- button要素を使用し、aria-label/titleにローカライズ済みラベルを設定

## i18n
- theme.light / theme.dark を使用
</spec>

<script lang="ts" setup>
type ThemeClass = 'theme-light' | 'theme-dark'

const props = defineProps<{
  themePreference: ThemeClass
  resolvedTheme: ThemeClass
  changeTheme: (theme: ThemeClass) => void
  labels: {
    light: string
    dark: string
  }
}>()

const iconName = computed(() => {
  return props.resolvedTheme === 'theme-light' ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'
})

const iconColor = computed(() => {
  return props.resolvedTheme === 'theme-light' ? 'rgb(244, 186, 67)' : 'rgb(122, 88, 237)'
})

const iconLabel = computed(() => {
  return props.resolvedTheme === 'theme-light' ? props.labels.light : props.labels.dark
})

const cycleTheme = () => {
  const nextTheme = props.themePreference === 'theme-light' ? 'theme-dark' : 'theme-light'
  props.changeTheme(nextTheme)
}
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="iconLabel"
    :title="iconLabel"
    @click="cycleTheme"
  >
    <Icon
      :name="iconName"
      class="icon is-medium"
      :style="{ color: iconColor }"
    />
  </button>
</template>

<style scoped>
.theme-toggle {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.icon {
  left: 4px !important;
  top: 4px !important;
}
</style>
