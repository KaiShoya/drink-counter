import { useUserState } from './state'

export function useUserActions () {
  const { isLogin, userName, userAvatarUrl, userSetting, isInitialized } = useUserState()

  const fetchUserData = async () => {
    try {
      const claims = useSupabaseUser()
      // v2: useSupabaseUser returns Claims (JWT payload) or null
      isLogin.value = !!claims.value

      // 基本情報は Claims に含まれる（email 等）。ユーザー名やアバターは user_metadata にある場合のみ取得。
      // 既存コードは user_metadata.name / avatar_url を参照しているため、必要時のみ getUser() を呼ぶ。
      if (isLogin.value) {
        const { data, error } = await useSupabaseClient().auth.getUser()
        if (error) {
          // ユーザーデータ取得に失敗した場合は安全にフォールバック
          userName.value = null
          userAvatarUrl.value = null
          logger.error('Failed to get user data', { module: 'user/actions.ts' }, error)
        } else {
          // テスト環境など Nuxt instance が無い場合は設定取得をスキップする
          try {
            const { $userSettingsRepository } = useNuxtApp()
            const userSettingRow = await $userSettingsRepository.fetchUserSettings()
            if (userSettingRow) {
              userSetting.value = userSettingRow
            } else {
              userSetting.value = null
            }
          } catch (settingsError) {
            userSetting.value = null
            logger.warn('Skipped user settings fetch', { module: 'user/actions.ts' }, settingsError)
          }

          userName.value = (data.user?.user_metadata as any)?.name ?? null
          userAvatarUrl.value = (data.user?.user_metadata as any)?.avatar_url ?? null
        }
      } else {
        userName.value = null
        userAvatarUrl.value = null
      }
    } catch {
      isLogin.value = false
      userName.value = null
      userAvatarUrl.value = null
    } finally {
      // 認証チェック完了を記録
      isInitialized.value = true
    }
  }

  return {
    fetchUserData,
  }
}
