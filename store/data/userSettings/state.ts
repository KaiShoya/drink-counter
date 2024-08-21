const userSettings = ref<UserSetting>({
  thresholdForDetectingOverdrinking: 2,
  timezone: 'Asia/Tokyo',
  switchingTiming: 9,
  name: null,
  avatarUrl: null,
})

export function useUserSettingsState () {
  return {
    userSettings,
  }
}
