import { useUserSettingsStore } from '~/store/data/userSettings'

export const useSettingsStore = defineStore('settingsStore', () => {
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
})
