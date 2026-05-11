import type { UserSettingsRow } from "~/repositories/userSettingsRepository"

export function createDefaultUserSetting (): UserSettingsRow {
  return {
    threshold_for_detecting_overdrinking: 2,
    timezone: 'Asia/Tokyo',
    switching_timing: 9,
  }
}

const isLogin = ref<boolean>(false)
const userName = ref<string | null>(null)
const userAvatarUrl = ref<string | null>(null)
const userSetting = ref<UserSettingsRow>(createDefaultUserSetting())
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
