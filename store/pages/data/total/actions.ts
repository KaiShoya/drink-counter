export const useTotalActions = () => {
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDow } = useAggregationByDowStore()
  const { fetchSumCount } = useAggregationByDrinksStore()

  const fetchDrinkCountersAll = async () => {
    await fetchDrinks()
    await fetchDrinkCounters()
    await fetchSumCount()
    await fetchAggregationByDow()
  }

  return {
    fetchDrinkCountersAll,
  }
}
