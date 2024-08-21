export const useIndexStore = defineStore('indexStore', () => {
  return {
    ...useIndexState(),
    ...useIndexGetters(),
    ...useIndexActions(),
  }
})
