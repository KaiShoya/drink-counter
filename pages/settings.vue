<script setup lang="ts">
import { useUserStore } from '@/store/userSettings'
const { updateThresholdForDetectingOverdrinking } = useSupabase()
const { userSettings, updateThreshold } = useUserStore()

const thresholdForDetectingOverdrinking: Ref<number> = useState(() => userSettings.thresholdForDetectingOverdrinking)

const click = () => {
  updateThresholdForDetectingOverdrinking(thresholdForDetectingOverdrinking.value).then(() => {
    updateThreshold(thresholdForDetectingOverdrinking.value)
  })
}
</script>

<template>
  <div>
    <table class="table is-hoverable is-fullwidth is-striped">
      <tr>
        <th>{{ $t('settings.threshold_for_detecting_overdrinking') }}</th>
        <td>
          <input
            v-model="thresholdForDetectingOverdrinking"
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
