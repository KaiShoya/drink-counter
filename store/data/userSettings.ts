import { useSupabaseStore } from '~/store/supabase'
import { UserSetting } from '~/store/data/types/userSetting'

export const useUserSettingsStore = defineStore('userSettings', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const userSettings: Ref<UserSetting> = useState(() => {
    return {
      thresholdForDetectingOverdrinking: 2,
      name: null,
      avatarUrl: null,
    }
  })

  const fetchUserSettings = async () => {
    const { data, error } = await supabase.rpc('get_user_settings')
    if (error) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    if (data) {
      userSettings.value.thresholdForDetectingOverdrinking = data!.threshold_for_detecting_overdrinking
    }
  }

  const updateThresholdForDetectingOverdrinking = async () => {
    await supabase.rpc('update_threshold_for_detecting_overdrinking', { threshold: userSettings.value.thresholdForDetectingOverdrinking })
  }

  return {
    userSettings,
    fetchUserSettings,
    updateThresholdForDetectingOverdrinking,
  }
})