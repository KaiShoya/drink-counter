import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowStore } from '~/store/pages/data/components/aggregationByDow'
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'

export const useTotalStore = defineStore('totalStore', () => {
  const { $i18n } = useNuxtApp()
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDow } = useAggregationByDowStore()
  const { fetchSumCount } = useAggregationByDrinksStore()

  const chartDataTitle = ['Name', 'Count']

  const fetchDrinkCountersAll = async () => {
    const fetchDrinksError = await fetchDrinks()
    if (fetchDrinksError) {
      showDangerToast($i18n.t(fetchDrinksError))
      return
    }
    const fetchDrinkCountersError = await fetchDrinkCounters()
    if (fetchDrinkCountersError) {
      showDangerToast($i18n.t(fetchDrinkCountersError))
      return
    }
    const fetchSumCountError = await fetchSumCount()
    if (fetchSumCountError) {
      showDangerToast($i18n.t(fetchSumCountError))
    }
    const fetchAggregationByDowError = await fetchAggregationByDow()
    if (fetchAggregationByDowError) {
      showDangerToast($i18n.t(fetchAggregationByDowError))
    }
  }

  return {
    chartDataTitle,
    fetchDrinkCountersAll,
  }
})
