const isLogin = ref<boolean>(false)
const userName = ref<string | null>(null)
const userAvatarUrl = ref<string | null>(null)
const isInitialized = ref<boolean>(false)
const accessToken = ref<string | null>(null)
const refreshToken = ref<string | null>(null)

export function useUserState () {
  async function initializeStore () {
    // init
  }

  return {
    isLogin,
    userName,
    userAvatarUrl,
    isInitialized,
    accessToken,
    refreshToken,
    initializeStore,
  }
}
