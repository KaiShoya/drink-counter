import type { UserSettingsRow } from "~/utils/api/userSettingsRepository"

const isLogin = ref<boolean>(false)
const userName = ref<string | null>(null)
const userAvatarUrl = ref<string | null>(null)
const userSetting = ref<UserSettingsRow>({
  threshold_for_detecting_overdrinking: 2,
  timezone: 'Asia/Tokyo',
  switching_timing: 9,
})
const isInitialized = ref<boolean>(false)

export function useUserState () {
  return {
    isLogin,
    userName,
    userAvatarUrl,
    userSetting,
    isInitialized,
  }
}
