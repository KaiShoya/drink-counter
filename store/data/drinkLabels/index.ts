export const useDrinkLabelsStore = defineStore('drinkLabelsStore', () => {
  return {
    ...useDrinkLabelsState(),
    ...useDrinkLabelsGetters(),
    ...useDrinkLabelsActions(),
  }
})
