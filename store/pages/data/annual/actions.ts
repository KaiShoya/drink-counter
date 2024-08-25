export const useAnnualActions = () => {
  const { year } = useAnnualState()

  const { showLoading, hideLoading } = useAppStore()
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCountersPerYear } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerYear } = useAggregationByDowStore()
  const { fetchSumCountPerYear } = useAggregationByDrinksStore()

  const fetchDrinkCounters = async () => {
    showLoading()
    await fetchDrinks()
    await fetchDrinkCountersPerYear(year.value)
    await fetchSumCountPerYear(year.value)
    await fetchAggregationByDowPerYear(year.value)
    hideLoading()
  }

  return {
    fetchDrinkCounters,
  }
}
