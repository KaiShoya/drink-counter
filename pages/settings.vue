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
        <th>{{ $t('settings.threshold_for_detecting_overdrinking') }}</th>
        <td>
          <input
            v-model="userSettings.thresholdForDetectingOverdrinking"
            class="input"
            type="number"
          >
        </td>
        <td>
          {{ $t('settings.cups') }}
        </td>
      </tr>

      <tr>
        <th>{{ $t('settings.timezone') }}</th>
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
        <th>{{ $t('settings.switching_timing') }}</th>
        <td>
          <input
            v-model="userSettings.switchingTiming"
            class="input"
            type="number"
          >
        </td>
        <td>{{ $t('settings.oclock') }}</td>
      </tr>
    </table>
    <button
      class="button"
      @click="updateSettings"
    >
      {{ $t('settings.save') }}
    </button>
  </div>
</template>
