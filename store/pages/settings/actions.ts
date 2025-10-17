export function useSettingsActions () {
  const { t } = useI18n()
  const userSettingsStore = useUserSettingsStore()
  const { updateUserSettings } = userSettingsStore

  const updateSettings = async () => {
    await updateUserSettings()
    showSuccessToast(t(LOCALE_GENERAL_UPDATE_SUCCESS))
  }

  return {
    updateSettings,
  }
}
