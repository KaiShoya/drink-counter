export const useAggregationByDowStore = defineStore('aggregationByDowStore', () => {
  return {
    ...useAggregationByDowState(),
    ...useAggregationByDowGetters(),
    ...useAggregationByDowActions(),
  }
})
