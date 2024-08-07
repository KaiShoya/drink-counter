export const useUserSettingsStore = defineStore('userSettingsStore', () => {
  return {
    ...useUserSettingsState(),
    ...useUserSettingsGetters(),
    ...useUserSettingsActions(),
  }
})
