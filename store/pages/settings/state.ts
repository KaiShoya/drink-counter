import type { UserSettingsRow } from "~/utils/api/userSettingsRepository"

const thresholdForDetectingOverdrinking = ref<number>(2)
const timezone = ref<string>('Asia/Tokyo')
const switchingTiming = ref<number>(9)

export function useSettingsState () {
  return {
    thresholdForDetectingOverdrinking,
    timezone,
    switchingTiming,
  }
}
