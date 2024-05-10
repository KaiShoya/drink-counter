import { useSupabaseStore } from '~/store/supabase'
import type { UserSetting } from '~/store/data/types/userSetting'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TABLE_NAME = 'user_settings'

export const useUserSettingsStore = defineStore('userSettings', () => {
  const { supabase } = useSupabaseStore()
  const userSettings = ref<UserSetting>({
    thresholdForDetectingOverdrinking: 2,
    timezone: 'Asia/Tokyo',
    switchingTiming: 9,
    name: null,
    avatarUrl: null,
  })

  const fetchUserSettings = async () => {
    const { data, error } = await supabase.rpc('get_user_settings')
    if (error) {
      throw new Response500Error()
    }
    if (data && data[0]) {
      userSettings.value.thresholdForDetectingOverdrinking = data[0]!.threshold_for_detecting_overdrinking
      userSettings.value.timezone = data[0]!.timezone
      userSettings.value.switchingTiming = data[0]!.switching_timing
    }
  }

  const updateUserSettings = async () => {
    const { error } = await supabase.rpc('update_user_settings', {
      threshold: userSettings.value.thresholdForDetectingOverdrinking,
      tz: userSettings.value.timezone,
      timing: userSettings.value.switchingTiming,
    })
    if (error) {
      throw new Response500Error()
    }
  }

  return {
    userSettings,
    fetchUserSettings,
    updateUserSettings,
  }
})
