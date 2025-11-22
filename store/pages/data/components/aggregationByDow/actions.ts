export const useAggregationByDowActions = () => {
  const { aggregationByDow } = useAggregationByDowState()

  const { $drinkCountersRepository } = useNuxtApp()

  const fetchAggregationByDow = async () => {
    aggregationByDow.value = await $drinkCountersRepository.fetchAggregationByDow()
  }

  const fetchAggregationByDowPerYear = async (year: number) => {
    aggregationByDow.value = await $drinkCountersRepository.fetchAggregationByDowPerYear(year)
  }

  const fetchAggregationByDowPerMonth = async (year: number, month: number) => {
    aggregationByDow.value = await $drinkCountersRepository.fetchAggregationByDowPerMonth(year, month)
  }

  return {
    fetchAggregationByDow,
    fetchAggregationByDowPerYear,
    fetchAggregationByDowPerMonth,
  }
}
