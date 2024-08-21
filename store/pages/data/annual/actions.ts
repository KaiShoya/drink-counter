export const useAnnualActions = () => {
  const { year } = useAnnualState()

  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCountersPerYear } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerYear } = useAggregationByDowStore()
  const { fetchSumCountPerYear } = useAggregationByDrinksStore()

  const fetchDrinkCounters = async () => {
    await fetchDrinks()
    await fetchDrinkCountersPerYear(year.value)
    await fetchSumCountPerYear(year.value)
    await fetchAggregationByDowPerYear(year.value)
  }

  return {
    fetchDrinkCounters,
  }
}
