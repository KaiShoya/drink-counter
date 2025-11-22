import type { AggregationByDow } from "~/utils/api/drinkCountersRepository"

const aggregationByDow = ref<Array<AggregationByDow>>([])

export const useAggregationByDowState = () => {
  return {
    aggregationByDow,
  }
}
