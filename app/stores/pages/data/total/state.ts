import type { DrinkCounterRow, AggregationByDow } from "~/repositories/drinkCountersRepository"
import type { DrinkRow } from "~/repositories/drinksRepository"
import type { DrinkLabelSummaryCountRow } from "~/repositories/drinkLabelsRepository"

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
