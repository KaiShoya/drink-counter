<script setup lang="ts">
const { getUserSettings, updateThresholdForDetectingOverdrinking } = useUserSettings()

const thresholdForDetectingOverdrinking: Ref<number> = useState(() => 2)
const userSettings = await getUserSettings()
thresholdForDetectingOverdrinking.value = userSettings?.threshold_for_detecting_overdrinking || thresholdForDetectingOverdrinking.value

const click = () => {
  updateThresholdForDetectingOverdrinking(thresholdForDetectingOverdrinking.value)
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
