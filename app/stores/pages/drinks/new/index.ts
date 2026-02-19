export const usePageDrinkNewStore = defineStore('pageDrinkNewStore', () => {
  return {
    ...usePageDrinkNewState(),
    ...usePageDrinkNewGetters(),
    ...usePageDrinkNewActions(),
  }
})
