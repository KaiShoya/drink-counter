<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserSettingsStore } from '~/store/data/userSettings'
import { useSettingsStore } from '~/store/pages/settings'

const userSettingsStore = useUserSettingsStore()
const { userSettings } = storeToRefs(userSettingsStore)
const { updateOverdrinkingThreshold } = useSettingsStore()
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
      @click="updateOverdrinkingThreshold"
    >
      {{ $t('settings.save') }}
    </button>
  </div>
</template>
