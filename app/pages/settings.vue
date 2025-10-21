<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_SETTINGS),
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
          <th>{{ $t(LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING) }}</th>
          <td>
            <input
              v-model="thresholdForDetectingOverdrinking"
              class="input"
              type="number"
            >
          </td>
          <td>
            {{ $t(LOCALE_SETTINGS_CUPS) }}
          </td>
        </tr>

        <tr>
          <th>{{ $t(LOCALE_SETTINGS_TIMEZONE) }}</th>
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
          <th>{{ $t(LOCALE_SETTINGS_SWITCHING_TIMING) }}</th>
          <td>
            <input
              v-model="switchingTiming"
              class="input"
              type="number"
            >
          </td>
          <td>{{ $t(LOCALE_SETTINGS_OCLOCK) }}</td>
        </tr>
      </tbody>
    </table>
    <button
      class="button"
      @click="updateSettings"
    >
      {{ $t(LOCALE_SETTINGS_SAVE) }}
    </button>
  </div>
</template>
