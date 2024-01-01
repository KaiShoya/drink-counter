import { useUserSettingsStore } from '~/store/data/userSettings'

export const useSettingsStore = defineStore('settingsStore', () => {
  const { $i18n } = useNuxtApp()
  const serSettingsStore = useUserSettingsStore()
  const { updateThresholdForDetectingOverdrinking } = serSettingsStore

  const click = async () => {
    const error = await updateThresholdForDetectingOverdrinking()
    if (error) {
      showDangerToast($i18n.t(error))
    } else {
      showSuccessToast($i18n.t('general.update_success'))
    }
  }

  return {
    click,
  }
})
