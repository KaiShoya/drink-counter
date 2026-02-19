export const usePageDrinkLabelEditStore = defineStore('pageDrinkLabelEditStore', () => {
  return {
    ...usePageDrinkLabelEditState(),
    ...usePageDrinkLabelEditGetters(),
    ...usePageDrinkLabelEditActions(),
  }
})
