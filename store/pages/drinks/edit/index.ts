export const usePageDrinkEditStore = defineStore('pageDrinkEditStore', () => {
  return {
    ...usePageDrinkEditState(),
    ...usePageDrinkEditGetters(),
    ...usePageDrinkEditActions(),
  }
})
