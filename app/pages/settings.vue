<spec lang="md">
# Settings Page

**Purpose**: ユーザー設定（過飲閾値、タイムゾーン、日付切替時刻）を編集する。

**Responsibilities**
- 現在設定の取得と表示
- 入力値の双方向バインドと保存

**Data**
- from page store: `settingsStore` → `thresholdForDetectingOverdrinking`, `timezone`, `switchingTiming`
- constants: `TIMEZONE`（タイムゾーン一覧）

**Interactions**
- `fetchSettings()` 初期読み込み
- `updateSettings()` 保存（成功時 toast、失敗時 error toast + logging は Page Store）

**i18n**
- すべてのラベル/ボタン文言は `utils/locales.ts` のキー管理

**Accessibility**
- 入力要素に適切なラベル関連付け（将来の改善項目）

**Notes**
- 閾値はトップページの過飲検知に連動
- タイムゾーン・切替時刻は日付計算ロジックと整合が必要
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
