export const useAppStore = defineStore('appStore', () => {
  return {
    ...useAppState(),
    ...useAppGetters(),
    ...useAppActions(),
  }
})
