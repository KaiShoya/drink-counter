
export function useSettingsActions () {
  const { t } = useI18n()
  const { $userSettingsRepository } = useNuxtApp()
  const { thresholdForDetectingOverdrinking, timezone, switchingTiming } = useSettingsState()
  const { userSetting } = storeToRefs(useUserStore())

  const fetchSettings = () => {
    thresholdForDetectingOverdrinking.value = userSetting.value.threshold_for_detecting_overdrinking
    timezone.value = userSetting.value.timezone
    switchingTiming.value = userSetting.value.switching_timing
  }

  const updateSettings = async () => {
    await $userSettingsRepository.updateUserSettings(
      thresholdForDetectingOverdrinking.value,
      timezone.value,
      switchingTiming.value,
    )
    showSuccessToast(t(LOCALE_GENERAL_UPDATE_SUCCESS))
  }

  return {
    fetchSettings,
    updateSettings,
  }
}
