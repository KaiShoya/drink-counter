import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useAggregationByDowStore } from '~/store/pages/data/components/aggregationByDow'
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'

export const useTotalStore = defineStore('totalStore', () => {
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks } = drinksStore
  const { fetchAggregationByDow } = useAggregationByDowStore()
  const { fetchSumCount } = useAggregationByDrinksStore()

  const fetchDrinkCountersAll = async () => {
    await fetchDrinks()
    await fetchDrinkCounters()
    await fetchSumCount()
    await fetchAggregationByDow()
  }

  return {
    fetchDrinkCountersAll,
  }
})
