<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useUserSettingsStore } from '~/store/data/userSettings'
import { useSettingsStore } from '~/store/pages/settings'
import { TIMEZONE } from '~/utils/constant.ts'

const userSettingsStore = useUserSettingsStore()
const { userSettings } = storeToRefs(userSettingsStore)
const { updateSettings } = useSettingsStore()
</script>

<template>
  <div>
    <table class="table is-hoverable is-fullwidth is-striped">
      <tr>
        <th>{{ $t(LOCALE_SETTINGS_THRESHOLD_FOR_DETECTING_OVERDRINKING) }}</th>
        <td>
          <input
            v-model="userSettings.thresholdForDetectingOverdrinking"
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
            <select @change="userSettings.timezone = ($event.target as HTMLInputElement).value">
              <option
                v-for="tz in TIMEZONE"
                :key="tz.timezone"
                :value="tz.timezone"
                :label="tz.timezone"
                :selected="userSettings.timezone === tz.timezone"
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
            v-model="userSettings.switchingTiming"
            class="input"
            type="number"
          >
        </td>
        <td>{{ $t(LOCALE_SETTINGS_OCLOCK) }}</td>
      </tr>
    </table>
    <button
      class="button"
      @click="updateSettings"
    >
      {{ $t(LOCALE_SETTINGS_SAVE) }}
    </button>
  </div>
</template>
