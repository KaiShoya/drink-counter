const chartDataTitle = ref<Array<string>>(['Name', 'Count'])
const aggregationByDrinks = ref<Array<AggregationByDrinkLabel>>([])

export const useAggregationByDrinksState = () => {
  return {
    chartDataTitle,
    aggregationByDrinks,
  }
}
