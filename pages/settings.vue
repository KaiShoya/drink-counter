<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserSettingsStore } from '~/store/data/userSettings'

const { $i18n } = useNuxtApp()

const serSettingsStore = useUserSettingsStore()
const { userSettings } = storeToRefs(serSettingsStore)
const { updateThresholdForDetectingOverdrinking } = serSettingsStore

const click = async () => {
  const error = await updateThresholdForDetectingOverdrinking()
  if (error) {
    showDangerToast($i18n.t(error))
  } else {
    showSuccessToast($i18n.t('general.update_success'))
  }
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
