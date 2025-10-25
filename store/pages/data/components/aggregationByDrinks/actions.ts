export const useAggregationByDrinksActions = () => {
  const { aggregationByDrinks, drinkLabels } = useAggregationByDrinksState()

  const { $drinkLabelsRepository } = useNuxtApp()

  const fetchSumCount = async () => {
    drinkLabels.value = await $drinkLabelsRepository.fetchAll()
    aggregationByDrinks.value = await $drinkLabelsRepository.fetchSumCount()
  }

  const fetchSumCountPerYear = async (year: number) => {
    drinkLabels.value = await $drinkLabelsRepository.fetchAll()
    aggregationByDrinks.value = await $drinkLabelsRepository.fetchSumCountPerYear(year)
  }

  const fetchSumCountPerMonth = async (year: number, month: number) => {
    drinkLabels.value = await $drinkLabelsRepository.fetchAll()
    aggregationByDrinks.value = await $drinkLabelsRepository.fetchSumCountPerMonth(year, month)
  }

  return {
    fetchSumCount,
    fetchSumCountPerYear,
    fetchSumCountPerMonth,
  }
}
