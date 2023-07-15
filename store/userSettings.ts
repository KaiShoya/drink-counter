interface UserSettings {
  thresholdForDetectingOverdrinking: Ref<number>
  name: Ref<string | null>
  avatarUrl: Ref<string | null>
}

export const useUserStore = defineStore('UserSettings', () => {
  const isLogin: Ref<boolean> = useState(() => false)
  const userSettings: UserSettings = {
    thresholdForDetectingOverdrinking: useState(() => 2),
    name: useState(() => null),
    avatarUrl: useState(() => null),
  }

  const setIsLogin = (loginStatus: boolean) => {
    isLogin.value = loginStatus
  }

  const setUserSettings = (data: any) => {
    // TODO: もっとマシな書き方ありそう（妥協
    userSettings.thresholdForDetectingOverdrinking.value = data?.threshold_for_detecting_overdrinking || userSettings.thresholdForDetectingOverdrinking.value
    userSettings.name.value = data?.name
    userSettings.avatarUrl.value = data?.avatar_url
  }

  const updateThreshold = (threshold: number) => {
    userSettings.thresholdForDetectingOverdrinking.value = threshold
  }

  return {
    isLogin,
    userSettings,
    setIsLogin,
    setUserSettings,
    updateThreshold,
  }
})
