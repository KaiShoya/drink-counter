export const usePageDrinksStore = defineStore('pageDrinksStore', () => {
  return {
    ...usePageDrinksState(),
    ...usePageDrinksGetters(),
    ...usePageDrinksActions(),
  }
})
