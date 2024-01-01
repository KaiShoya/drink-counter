import { useUserSettingsStore } from '~/store/data/userSettings'

export const useSettingsStore = defineStore('settingsStore', () => {
  const { $i18n } = useNuxtApp()
  const userSettingsStore = useUserSettingsStore()
  const { updateThresholdForDetectingOverdrinking } = userSettingsStore

  const updateOverdrinkingThreshold = async () => {
    const error = await updateThresholdForDetectingOverdrinking()
    if (error) {
      showDangerToast($i18n.t(error))
    } else {
      showSuccessToast($i18n.t('general.update_success'))
    }
  }

  return {
    updateOverdrinkingThreshold,
  }
})
