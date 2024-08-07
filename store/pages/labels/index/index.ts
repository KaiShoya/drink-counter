export const usePageDrinkLabelsStore = defineStore('pageDrinkLabelsStore', () => {
  return {
    ...usePageDrinkLabelsState(),
    ...usePageDrinkLabelsGetters(),
    ...usePageDrinkLabelsActions(),
  }
})
