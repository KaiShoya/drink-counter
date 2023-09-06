import { useSupabaseStore } from './supabase'

interface UserSettings {
  thresholdForDetectingOverdrinking: Ref<number>
  name: Ref<string | null>
  avatarUrl: Ref<string | null>
}

export const useUserStore = defineStore('user', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const isLogin: Ref<boolean> = useState(() => false)
  const userSettings: UserSettings = {
    thresholdForDetectingOverdrinking: useState(() => 2),
    name: useState(() => null),
    avatarUrl: useState(() => null),
  }

  const getUser = async () => {
    const { data: sessionData, error: sessionError } = await useAsyncData(
      'getSession',
      () => supabase.auth.getSession(),
    )
    if (sessionError.value) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    if (sessionData.value?.data.session === null || sessionData.value?.data.session === undefined) {
      return false
    }

    const { data: userData, error: userError } = await useAsyncData(
      'getUser',
      () => supabase.auth.getUser(),
    )
    if (userError.value) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    }
    isLogin.value = userData.value?.data.user !== null
    userSettings.name.value = userData.value?.data.user?.user_metadata?.name
    userSettings.avatarUrl.value = userData.value?.data.user?.user_metadata?.avatar_url
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
