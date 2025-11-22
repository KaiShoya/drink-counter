export const useAnnualActions = () => {
  const { year, drinks, drinkCounters, aggregationByDrinks, aggregationByDow} = useAnnualState()

  const { showLoading, hideLoading } = useAppStore()
  const { $drinksRepository, $drinkCountersRepository, $drinkLabelsRepository } = useNuxtApp()

  const fetchDrinkCounters = async () => {
    showLoading()
    drinks.value = await $drinksRepository.fetchAll()
    drinkCounters.value = await $drinkCountersRepository.fetchByYear(year.value)
    aggregationByDrinks.value = await $drinkLabelsRepository.fetchSumCountPerYear(year.value)
    aggregationByDow.value = await $drinkCountersRepository.fetchAggregationByDowPerYear(year.value)
    hideLoading()
  }

  return {
    fetchDrinkCounters,
  }
}
