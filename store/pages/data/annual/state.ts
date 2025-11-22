import type { DrinkCounterRow, AggregationByDow } from "~/utils/api/drinkCountersRepository"
import type { DrinkRow } from "~/utils/api/drinksRepository"
import type { DrinkLabelSummaryCountRow } from "~/utils/api/drinkLabelsRepository"

const year = ref<number>((new Date()).getFullYear())
const drinks = ref<DrinkRow[]>([])
const drinkCounters = ref<DrinkCounterRow[]>([])
const aggregationByDrinks = ref<Array<DrinkLabelSummaryCountRow>>([])
const aggregationByDow = ref<Array<AggregationByDow>>([])

// カレンダー用データ
const calendarTitle = ref<Array<{ type: string, id: string }>>([
  {
    type: 'date',
    id: 'Date',
  },
  {
    type: 'number',
    id: 'Count',
  },
])

export const useAnnualState = () => {
  return {
    year,
    drinks,
    drinkCounters,
    aggregationByDrinks,
    aggregationByDow,
    calendarTitle,
  }
}
