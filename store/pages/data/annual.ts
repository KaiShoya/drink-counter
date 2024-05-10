import { storeToRefs } from 'pinia'

import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowStore } from '~/store/pages/data/components/aggregationByDow'
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'

export const useAnnualStore = defineStore('annualStore', () => {
  const { formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersPerYear } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { getDrinksIdArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerYear } = useAggregationByDowStore()
  const { fetchSumCountPerYear } = useAggregationByDrinksStore()

  const year = ref<number>((new Date()).getFullYear())

  const prevYear = () => year.value--
  const nextYear = () => year.value++

  const fetchDrinkCounters = async () => {
    await fetchDrinks()
    await fetchDrinkCountersPerYear(year.value)
    await fetchSumCountPerYear(year.value)
    await fetchAggregationByDowPerYear(year.value)
  }

  /**
   * カレンダー用データ
   */
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
  const computeCalendarData = computed(() => {
    return Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => [new Date(key), value[0]])
  })

  return {
    year,
    calendarTitle,
    prevYear,
    nextYear,
    fetchDrinkCounters,
    computeCalendarData,
  }
})
