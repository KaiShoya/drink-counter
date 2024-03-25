import { storeToRefs } from 'pinia'

import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowTablesStore } from '~/store/pages/data/components/aggregationByDowTables'
import { useAggregationByDrinksTablesStore } from '~/store/pages/data/components/aggregationByDrinksTables'

export const useAnnualStore = defineStore('annualStore', () => {
  const { $i18n } = useNuxtApp()
  const { formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersPerYear } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { getDrinksIdArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDowPerYear } = useAggregationByDowTablesStore()
  const { fetchSumCountPerYear } = useAggregationByDrinksTablesStore()

  const year = ref<number>((new Date()).getFullYear())

  const prevYear = () => year.value--
  const nextYear = () => year.value++

  const fetchDrinkCounters = async () => {
    const fetchDrinksError = await fetchDrinks()
    if (fetchDrinksError) {
      showDangerToast($i18n.t(fetchDrinksError))
      return
    }
    const fetchDrinkCountersPerYearError = await fetchDrinkCountersPerYear(year.value)
    if (fetchDrinkCountersPerYearError) {
      showDangerToast($i18n.t(fetchDrinkCountersPerYearError))
      return
    }
    const fetchSumCountPerYearError = await fetchSumCountPerYear(year.value)
    if (fetchSumCountPerYearError) {
      showDangerToast($i18n.t(fetchSumCountPerYearError))
    }
    const fetchAggregationByDowPerYearError = await fetchAggregationByDowPerYear(year.value)
    if (fetchAggregationByDowPerYearError) {
      showDangerToast($i18n.t(fetchAggregationByDowPerYearError))
    }
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
