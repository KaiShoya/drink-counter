import { storeToRefs } from 'pinia'

import { useSupabaseStore } from './supabase'
import { useDrinkCountersStore } from './drinkCounters'
import { useDrinksStore } from './drinks'
import { NumberOfDrink } from './types/numberOfDrink'

export const useNumberOfDrinksStore = defineStore('numberOfDrinksStore', () => {
  const { supabase } = useSupabaseStore()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCountersForDay } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore

  const numberOfDrinks: Ref<NumberOfDrink[]> = useState('numberOfDrinks', () => [])
  const drinkCountForDay: Ref<number> = useState('drinkCountForDay', () => 0)

  const fetchDrinksAndCounts = async (date: string) => {
    await fetchDrinks()
    await fetchDrinkCountersForDay(date)
    numberOfDrinks.value = []
    drinks.value.forEach((drink) => {
      const drinkCounter = drinkCounters.value.find(drinkCounter => drinkCounter.drink_id === drink.id)
      numberOfDrinks.value.push({
        id: drink.id,
        name: drink.name,
        count: drinkCounter?.count ?? 0,
        drinkCounterId: drinkCounter?.id ?? -1,
      })
    })

    const { data } = await supabase.from('drinks').select('*')
    drinks.value = data ?? []
  }

  return {
    numberOfDrinks,
    drinkCountForDay,
    fetchDrinksAndCounts,
  }
})
