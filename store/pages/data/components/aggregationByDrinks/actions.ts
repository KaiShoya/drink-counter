export const useAggregationByDrinksActions = () => {
  const { aggregationByDrinks } = useAggregationByDrinksState()

  const { supabase } = useSupabaseStore()

  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels } = drinkLabelsStore

  const fetchSumCount = async () => {
    await fetchDrinkLabels()

    const { data, error } = await supabase.rpc('aggregation_by_drink_labels')
    if (error) {
      throw new Response500Error()
    }
    aggregationByDrinks.value = data ?? []
  }

  const fetchSumCountPerYear = async (year: number) => {
    await fetchDrinkLabels()

    const { data, error } = await supabase.rpc('aggregation_by_drink_labels', { year })
    if (error) {
      throw new Response500Error()
    }
    aggregationByDrinks.value = data ?? []
  }

  const fetchSumCountPerMonth = async (year: number, month: number) => {
    await fetchDrinkLabels()

    const { data, error } = await supabase.rpc('aggregation_by_drink_labels', { year, month })
    if (error) {
      throw new Response500Error()
    }
    aggregationByDrinks.value = data ?? []
  }

  return {
    fetchSumCount,
    fetchSumCountPerYear,
    fetchSumCountPerMonth,
  }
}
