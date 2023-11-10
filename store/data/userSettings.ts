import { useSupabaseStore } from '~/store/supabase'
import type { UserSetting } from '~/store/data/types/userSetting'

export const useUserSettingsStore = defineStore('userSettings', () => {
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
    if (!error && data && data[0]) {
      userSettings.value.thresholdForDetectingOverdrinking = data[0]!.threshold_for_detecting_overdrinking
    }
    return error
  }

  const updateThresholdForDetectingOverdrinking = async () => {
    const { error } = await supabase.rpc('update_threshold_for_detecting_overdrinking', { threshold: userSettings.value.thresholdForDetectingOverdrinking })
    return error
  }

  return {
    userSettings,
    fetchUserSettings,
    updateThresholdForDetectingOverdrinking,
  }
})
