export const useDrinkCountersStore = defineStore('drinkCountersStore', () => {
  return {
    ...useDrinkCountersState(),
    ...useDrinkCountersGetters(),
    ...useDrinkCountersActions(),
  }
})
