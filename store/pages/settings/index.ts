export const useSettingsStore = defineStore('settingsStore', () => {
  return {
    ...useSettingsState(),
    ...useSettingsGetters(),
    ...useSettingsActions(),
  }
})
