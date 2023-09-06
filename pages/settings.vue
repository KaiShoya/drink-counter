<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'

const { updateThresholdForDetectingOverdrinking } = useSupabase()

const userStore = useUserStore()
const { userSettings } = storeToRefs(userStore)
const { updateThreshold } = userStore

// const thresholdForDetectingOverdrinking: Ref<number> = useState('threshold')
const { data: thresholdForDetectingOverdrinking } = await useAsyncData('threshold', () => userSettings.thresholdForDetectingOverdrinking)
thresholdForDetectingOverdrinking.value = userSettings.thresholdForDetectingOverdrinking

const click = () => {
  updateThresholdForDetectingOverdrinking(Number(thresholdForDetectingOverdrinking.value)).then(() => {
    updateThreshold(Number(thresholdForDetectingOverdrinking.value))
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
