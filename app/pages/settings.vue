<spec lang="md">
# Settings Page

ユーザー設定（過飲閾値、タイムゾーン、日付切替時刻）を編集する画面。

## Data
- page store: `settingsStore` → `thresholdForDetectingOverdrinking`, `timezone`, `switchingTiming`
- constants: `TIMEZONE`（タイムゾーン一覧）

## Interactions
- 初期表示で `fetchSettings()`
- 保存ボタンで `updateSettings()`

## Features
- 数値入力（過飲閾値 / 日付切替時刻）
- タイムゾーン選択（`TIMEZONE` から選択）

## Error Handling
- 保存失敗時の toast / logging は Page Store が担当（画面では直接処理しない）

## i18n
- すべてのラベル/ボタン文言は `utils/locales.ts` のキー管理

## Accessibility
- 入力要素に適切なラベル関連付け（将来の改善項目）

## Notes
- 過飲閾値はトップページの警告判定に連動
- タイムゾーン/切替時刻は日付計算ロジックと整合が必要
</spec>

<script setup lang="ts">
import { LOCALE_ROUTES_SETTINGS, LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING, LOCALE_SETTINGS_CUPS, LOCALE_SETTINGS_TIMEZONE, LOCALE_SETTINGS_SWITCHING_TIMING, LOCALE_SETTINGS_OCLOCK, LOCALE_SETTINGS_SAVE } from '~/utils/locales'
import { TIMEZONE } from '~/utils/constant'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_SETTINGS),
})

const settingsStore = useSettingsStore()
const { thresholdForDetectingOverdrinking, timezone, switchingTiming } = storeToRefs(settingsStore)
const { fetchSettings, updateSettings } = settingsStore

fetchSettings()
</script>

<template>
  <div>
    <table class="table is-hoverable is-fullwidth is-striped">
      <tbody>
        <tr>
          <th>{{ t(LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING) }}</th>
          <td>
            <input
              v-model="thresholdForDetectingOverdrinking"
              class="input"
              type="number"
            >
          </td>
          <td>
            {{ t(LOCALE_SETTINGS_CUPS) }}
          </td>
        </tr>

        <tr>
          <th>{{ t(LOCALE_SETTINGS_TIMEZONE) }}</th>
          <td>
            <div class="select">
              <select @change="timezone = ($event.target as HTMLInputElement).value">
                <option
                  v-for="tz in TIMEZONE"
                  :key="tz.timezone"
                  :value="tz.timezone"
                  :label="tz.timezone"
                  :selected="timezone === tz.timezone"
                />
              </select>
            </div>
          </td>
          <td />
        </tr>

        <tr>
          <th>{{ t(LOCALE_SETTINGS_SWITCHING_TIMING) }}</th>
          <td>
            <input
              v-model="switchingTiming"
              class="input"
              type="number"
            >
          </td>
          <td>{{ t(LOCALE_SETTINGS_OCLOCK) }}</td>
        </tr>
      </tbody>
    </table>
    <button
      class="button"
      @click="updateSettings"
    >
      {{ t(LOCALE_SETTINGS_SAVE) }}
    </button>
  </div>
</template>
