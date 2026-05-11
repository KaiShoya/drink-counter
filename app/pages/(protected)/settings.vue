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
- トップ画面の目標ペースガイド表示の ON/OFF 切り替え

## Error Handling
- 保存失敗時の toast / logging は Page Store が担当（画面では直接処理しない）

## i18n
- すべてのラベル/ボタン文言は `utils/locales.ts` のキー管理

## Accessibility
- 各入力要素に `id` を付与し `<label for>` で関連付け済み
- スクリーンリーダーで各フィールドが正しくアナウンスされる

## Notes
- 過飲閾値はトップページの警告判定に連動
- タイムゾーン/切替時刻は日付計算ロジックと整合が必要
</spec>

<script setup lang="ts">
import {
  LOCALE_ROUTES_SETTINGS,
  LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING,
  LOCALE_SETTINGS_CUPS,
  LOCALE_SETTINGS_TIMEZONE,
  LOCALE_SETTINGS_SWITCHING_TIMING,
  LOCALE_SETTINGS_OCLOCK,
  LOCALE_SETTINGS_SAVE,
  LOCALE_SETTINGS_SHOW_PACE_GUIDE,
} from '~/utils/locales'
import { TIMEZONE } from '~/utils/constant'

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_SETTINGS),
})

const settingsStore = useSettingsStore()
const { thresholdForDetectingOverdrinking, timezone, switchingTiming, showPaceGuide } = storeToRefs(settingsStore)
const { fetchSettings, updateSettings } = settingsStore

fetchSettings()
</script>

<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" for="threshold">{{ t(LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING) }}</label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <div class="control">
            <input
              id="threshold"
              v-model="thresholdForDetectingOverdrinking"
              class="input"
              type="number"
              min="1"
            >
          </div>
          <div class="control">
            <span class="button is-static">{{ t(LOCALE_SETTINGS_CUPS) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" for="timezone">{{ t(LOCALE_SETTINGS_TIMEZONE) }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <div class="select">
              <select
                id="timezone"
                @change="timezone = ($event.target as HTMLInputElement).value"
              >
                <option
                  v-for="tz in TIMEZONE"
                  :key="tz.timezone"
                  :value="tz.timezone"
                  :label="tz.timezone"
                  :selected="timezone === tz.timezone"
                />
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" for="switching-timing">{{ t(LOCALE_SETTINGS_SWITCHING_TIMING) }}</label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <div class="control">
            <input
              id="switching-timing"
              v-model="switchingTiming"
              class="input"
              type="number"
              min="0"
              max="23"
            >
          </div>
          <div class="control">
            <span class="button is-static">{{ t(LOCALE_SETTINGS_OCLOCK) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label" />
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox" for="show-pace-guide">
              <input
                id="show-pace-guide"
                v-model="showPaceGuide"
                type="checkbox"
              >
              {{ t(LOCALE_SETTINGS_SHOW_PACE_GUIDE) }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label" />
      <div class="field-body">
        <div class="field">
          <div class="control">
            <button
              class="button"
              @click="updateSettings"
            >
              {{ t(LOCALE_SETTINGS_SAVE) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
