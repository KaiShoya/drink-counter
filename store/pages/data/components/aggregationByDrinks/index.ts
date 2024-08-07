export const useAggregationByDrinksStore = defineStore('aggregationByDrinksStore', () => {
  return {
    ...useAggregationByDrinksState(),
    ...useAggregationByDrinksGetters(),
    ...useAggregationByDrinksActions(),
  }
})
