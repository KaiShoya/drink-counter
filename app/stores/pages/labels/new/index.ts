export const usePageDrinkLabelNewStore = defineStore('pageDrinkLabelNewStore', () => {
  return {
    ...usePageDrinkLabelNewState(),
    ...usePageDrinkLabelNewGetters(),
    ...usePageDrinkLabelNewActions(),
  }
})
