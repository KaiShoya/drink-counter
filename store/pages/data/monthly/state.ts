import type { DrinkCounterRow, AggregationByDow } from "~/repositories/drinkCountersRepository"
import type { DrinkRow } from "~/repositories/drinksRepository"
import type { DrinkLabelSummaryCountRow } from "~/repositories/drinkLabelsRepository"

const { processIntoYearMonth } = useProcessDate()

const yearMonth = ref<string>(processIntoYearMonth(new Date()))
const graphDataTitleBase = ['日付', '合計']
const graphDataTitle = ref<string[]>(graphDataTitleBase)
const drinks = ref<DrinkRow[]>([])
const drinkCounters = ref<DrinkCounterRow[]>([])
const aggregationByDrinks = ref<Array<DrinkLabelSummaryCountRow>>([])
const aggregationByDow = ref<Array<AggregationByDow>>([])

export const useMonthlyState = () => {
  return {
    yearMonth,
    graphDataTitleBase,
    graphDataTitle,
    drinks,
    drinkCounters,
    aggregationByDrinks,
    aggregationByDow,
  }
}
