<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserSettingsStore } from '~/store/data/userSettings'

const serSettingsStore = useUserSettingsStore()
const { userSettings } = storeToRefs(serSettingsStore)
const { updateThresholdForDetectingOverdrinking } = serSettingsStore

const click = () => {
  updateThresholdForDetectingOverdrinking()
}
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
    </table>
    <button
      class="button"
      @click="click"
    >
      {{ $t('settings.save') }}
    </button>
  </div>
</template>
