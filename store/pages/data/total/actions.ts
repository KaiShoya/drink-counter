export const useTotalActions = () => {
  const { drinks, drinkCounters, aggregationByDrinks, aggregationByDow } = useTotalState()

  const { showLoading, hideLoading } = useAppStore()

  const { $drinksRepository, $drinkCountersRepository, $drinkLabelsRepository } = useNuxtApp()

  const fetchDrinkCountersAll = async () => {
    showLoading()

    drinks.value = await $drinksRepository.fetchAll()
    drinkCounters.value = await $drinkCountersRepository.fetchAll()
    aggregationByDrinks.value = await $drinkLabelsRepository.fetchSumCount()
    aggregationByDow.value = await $drinkCountersRepository.fetchAggregationByDow()

    hideLoading()
  }

  return {
    fetchDrinkCountersAll,
  }
}
