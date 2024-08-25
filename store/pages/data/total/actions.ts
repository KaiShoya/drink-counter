export const useTotalActions = () => {
  const { showLoading, hideLoading } = useAppStore()
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDow } = useAggregationByDowStore()
  const { fetchSumCount } = useAggregationByDrinksStore()

  const fetchDrinkCountersAll = async () => {
    showLoading()
    await fetchDrinks()
    await fetchDrinkCounters()
    await fetchSumCount()
    await fetchAggregationByDow()
    hideLoading()
  }

  return {
    fetchDrinkCountersAll,
  }
}
