import { useSupabaseStore } from '~/store/supabase'
import type { UserSetting } from '~/store/data/types/userSetting'

export const useUserSettingsStore = defineStore('userSettings', () => {
  const { supabase } = useSupabaseStore()
  const userSettings = ref<UserSetting>({
    thresholdForDetectingOverdrinking: 2,
    name: null,
    avatarUrl: null,
  })

  const fetchUserSettings = async () => {
    const { data, error } = await supabase.rpc('get_user_settings')
    if (error) {
      return 'error.500_API_ERROR'
    }
    if (data && data[0]) {
      userSettings.value.thresholdForDetectingOverdrinking = data[0]!.threshold_for_detecting_overdrinking
    } else {
      return 'error.GET_USER_INFO'
    }
  }

  const updateThresholdForDetectingOverdrinking = async () => {
    const { error } = await supabase.rpc('update_threshold_for_detecting_overdrinking', { threshold: userSettings.value.thresholdForDetectingOverdrinking })
    if (error) {
      return 'error.500_API_ERROR'
    }
  }

  return {
    userSettings,
    fetchUserSettings,
    updateThresholdForDetectingOverdrinking,
  }
})
