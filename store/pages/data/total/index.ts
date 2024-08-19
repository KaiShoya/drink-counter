export const useTotalStore = defineStore('totalStore', () => {
  return {
    ...useTotalState(),
    ...useTotalGetters(),
    ...useTotalActions(),
  }
})
