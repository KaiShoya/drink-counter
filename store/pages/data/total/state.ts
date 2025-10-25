import type { DrinkCounterRow, AggregationByDow } from "~/utils/api/drinkCountersRepository"
import type { DrinkRow } from "~/utils/api/drinksRepository"
import type { DrinkLabelSummaryCountRow } from "~/utils/api/drinkLabelsRepository"

const drinks = ref<DrinkRow[]>([])
const drinkCounters = ref<DrinkCounterRow[]>([])
const aggregationByDrinks = ref<Array<DrinkLabelSummaryCountRow>>([])
const aggregationByDow = ref<Array<AggregationByDow>>([])

export const useTotalState = () => {
  return {
    drinks,
    drinkCounters,
    aggregationByDrinks,
    aggregationByDow,
  }
}
