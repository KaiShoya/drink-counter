import type { AggregationByDow } from "~/repositories/drinkCountersRepository"

const aggregationByDow = ref<Array<AggregationByDow>>([])

export const useAggregationByDowState = () => {
  return {
    aggregationByDow,
  }
}
