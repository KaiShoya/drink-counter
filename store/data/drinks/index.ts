export const useDrinksStore = defineStore('drinksStore', () => {
  return {
    ...useDrinksState(),
    ...useDrinksGetters(),
    ...useDrinksActions(),
  }
})
