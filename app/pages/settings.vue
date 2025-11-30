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
