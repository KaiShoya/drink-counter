const aggregationByDow = ref<Array<AggregationByDow>>([])

export const useAggregationByDowState = () => {
  return {
    aggregationByDow,
  }
}
