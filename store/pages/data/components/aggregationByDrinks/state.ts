import type { DrinkLabelWithDefaultColor, DrinkLabelSummaryCountRow } from "~/utils/api/drinkLabelsRepository"

const chartDataTitle = ref<Array<string>>(['Name', 'Count'])
const aggregationByDrinks = ref<Array<DrinkLabelSummaryCountRow>>([])
const drinkLabels = ref<DrinkLabelWithDefaultColor[]>([])

export const useAggregationByDrinksState = () => {
  return {
    chartDataTitle,
    aggregationByDrinks,
    drinkLabels,
  }
}
