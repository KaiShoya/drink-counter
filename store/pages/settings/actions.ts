export function useSettingsActions () {
  const { $i18n } = useNuxtApp()
  const userSettingsStore = useUserSettingsStore()
  const { updateUserSettings } = userSettingsStore

  const updateSettings = async () => {
    await updateUserSettings()
    showSuccessToast($i18n.t(LOCALE_GENERAL_UPDATE_SUCCESS))
  }

  return {
    updateSettings,
  }
}
