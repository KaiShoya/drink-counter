import { storeToRefs } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { NumberOfDrink } from '~/store/types/numberOfDrink'

export const useIndexStore = defineStore('numberOfDrinksStore', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const { processIntoString } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCountersForDay, findDrinkCountersByDrinkId, increment, decrement, create } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore

  const date: Ref<string> = useState('date', () => '')
  const numberOfDrinks: Ref<NumberOfDrink[]> = useState('numberOfDrinks', () => [])
  const drinkCountForDay: Ref<number> = useState('drinkCountForDay', () => 0)
  const isLoading: Ref<boolean> = useState(() => false)

  /**
   * 日付を取得する
   */
  const fetchDate = async () => {
    const { data } = await supabase.rpc('get_date')
    date.value = String(data.split(' ')[0])
  }

  const findNumberOfDrinkByDrinkId = (drinkId: number) => {
    return numberOfDrinks.value.find(nod => nod.id === drinkId)
  }
  // const findNumberOfDrinkByDrinkCounterId = (drinkCounterId: number) => {
  //   return numberOfDrinks.value.find(nod => nod.drinkCounterId === drinkCounterId)
  // }

  /**
   * 指定した日付の飲んだ杯数を取得する
   * @param date 日付 '2023-01-01'
   */
  const fetchNumberOfDrinks = async (date: string) => {
    isLoading.value = true
    try {
      await fetchDrinks()
      await fetchDrinkCountersForDay(date)

      numberOfDrinks.value = []
      drinkCountForDay.value = 0

      drinks.value.forEach((drink) => {
        const drinkCounter = findDrinkCountersByDrinkId(drink.id)
        numberOfDrinks.value.push({
          id: drink.id,
          name: drink.name,
          count: drinkCounter?.count ?? 0,
          drinkCounterId: drinkCounter?.id ?? -1,
        })
        drinkCountForDay.value += drinkCounter?.count ?? 0
      })
    } catch (error) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.500_API_ERROR') })
    } finally {
      isLoading.value = false
    }
  }

  const plus = async (drinkId: number, drinkCounterId: number) => {
    const numberOfDrink = findNumberOfDrinkByDrinkId(drinkId)
    if (drinkCounterId === -1) {
      // レコードがなければ作成する
      const newDrinkCounterId = await create(drinkId, date.value)
      // DrinkCounterId更新
      numberOfDrink!.drinkCounterId = newDrinkCounterId
    } else {
      await increment(drinkCounterId)
    }
    numberOfDrink!.count++
    drinkCountForDay.value++
  }
  const minus = async (drinkId: number, drinkCounterId: number) => {
    // レコードがなければ何もしない
    if (drinkCounterId === -1) {
      return
    }
    const numberOfDrink = findNumberOfDrinkByDrinkId(drinkId)
    // レコードが取れない or 杯数が0だったら何もしない
    if (numberOfDrink === undefined || numberOfDrink.count === 0) {
      return
    }
    await decrement(drinkCounterId)
    numberOfDrink.count--
    drinkCountForDay.value--
  }

  return {
    date,
    numberOfDrinks,
    drinkCountForDay,
    isLoading,
    fetchDate,
    fetchNumberOfDrinks,
    plus,
    minus,
  }
})
