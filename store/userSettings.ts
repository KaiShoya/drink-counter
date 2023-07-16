interface UserSettings {
  thresholdForDetectingOverdrinking: Ref<number>
  name: Ref<string | null>
  avatarUrl: Ref<string | null>
}

export const useUserStore = defineStore('UserSettings', () => {
  const { $i18n } = useNuxtApp()
  const isLogin: Ref<boolean> = useState(() => false)
  const userSettings: UserSettings = {
    thresholdForDetectingOverdrinking: useState(() => 2),
    name: useState(() => null),
    avatarUrl: useState(() => null),
  }

  const getUser = async () => {
    const { data: sessionData, error: sessionError } = await useAsyncData(
      'getSession',
      () => supabase().auth.getUser(),
    )
    if (sessionError.value) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    isLogin.value = sessionData.value?.data.user !== null
    userSettings.name.value = sessionData.value?.data.user?.user_metadata?.name
    userSettings.avatarUrl.value = sessionData.value?.data.user?.user_metadata?.avatar_url
    return isLogin.value
  }

  const setUserSettings = (data: any) => {
    // TODO: もっとマシな書き方ありそう（妥協
    userSettings.thresholdForDetectingOverdrinking.value = data?.threshold_for_detecting_overdrinking || userSettings.thresholdForDetectingOverdrinking.value
    // userSettings.name.value = data?.name
    // userSettings.avatarUrl.value = data?.avatar_url
  }

  const updateThreshold = (threshold: number) => {
    userSettings.thresholdForDetectingOverdrinking.value = threshold
  }

  return {
    isLogin,
    userSettings,
    getUser,
    setUserSettings,
    updateThreshold,
  }
})
