export const useActivityLogStore = defineStore('activityLogStore', () => {
  return {
    ...useActivityLogState(),
    ...useActivityLogGetters(),
    ...useActivityLogActions(),
  }
})
