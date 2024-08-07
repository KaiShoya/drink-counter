// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TABLE_NAME = 'user_settings'

export function useUserSettingsActions () {
  const { supabase } = useSupabaseStore()
  const { userSettings } = useUserSettingsState()

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
    fetchUserSettings,
    updateUserSettings,
  }
}
