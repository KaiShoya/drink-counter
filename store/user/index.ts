export const useUserStore = defineStore('userStore', () => {
  return {
    ...useUserState(),
    ...useUserGetters(),
    ...useUserActions(),
  }
})
