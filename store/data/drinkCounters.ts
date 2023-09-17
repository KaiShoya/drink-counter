import { useSupabaseStore } from '~/store/supabase'
import { DrinkCounter } from '~/store/data/types/drinkCounter'

export const useDrinkCountersStore = defineStore('drinkCountersStore', () => {
  const { $i18n } = useNuxtApp()
  const { supabase } = useSupabaseStore()
  const drinkCounters: Ref<DrinkCounter[]> = useState(() => [])

  /**
   * drinkCountersから指定したidのレコードを取得する
   * @param id drinkCounter.id
   * @returns DrinkCounter | undefined
   */
  const findDrinkCountersById = (id: number) => {
    return drinkCounters.value.find(dc => dc.id === id)
  }

  /**
   * drinkCountersから指定したdrink.idのレコードを取得する
   * @param id drink.id
   * @returns DrinkCounter | undefined
   */
  const findDrinkCountersByDrinkId = (id: number) => {
    return drinkCounters.value.find(dc => dc.drink_id === id)
  }

  /**
   * 自分のデータを全件取得する
   */
  const fetchDrinkCounters = async () => {
    const { data } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0)
    drinkCounters.value = data ?? []
  }

  /**
   * 指定した月の自分のデータを取得する
   * @param year 年
   * @param month 月
   */
  const fetchDrinkCountersPerMonth = async (year: number, month: number) => {
    const { data } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0).gte('date', `${year}-${month}-01`).lt('date', `${year}-${month + 1}-01`)
    drinkCounters.value = data ?? []
  }

  /**
   * 指定した日付(string)の自分のデータを取得する
   * @param date 日付 '2023-01-01'
   */
  const fetchDrinkCountersForDay = async (date: string) => {
    const { data } = await supabase.from('drink_counters').select('*').eq('date', date)
    drinkCounters.value = data ?? []
  }

  /**
   * 指定したレコードを+1する
   * @param id drinkCounter.id
   */
  const increment = async (id: number) => {
    const drinkCounter = findDrinkCountersById(id)
    if (!drinkCounter) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.GET_RECORD') })
    }
    const { data } = await supabase.rpc('increment', { row_id: id })
    drinkCounter.count = data?.count ?? 0
  }

  /**
   * 指定したレコードを-1する
   * @param id drinkCounter.id
   */
  const decrement = async (id: number) => {
    const drinkCounter = findDrinkCountersById(id)
    if (!drinkCounter) {
      throw createError({ statusCode: 500, statusMessage: $i18n.t('error.GET_RECORD') })
    }
    if (drinkCounter.count <= 0) {
      return
    }
    const { data } = await supabase.rpc('decrement', { row_id: id })
    drinkCounter.count = data?.count ?? 0
  }

  /**
   * 指定した日付のレコードを作成する
   * @param drinkId drink.id
   * @param date 日付 '2023-01-01'
   */
  const create = async (drinkId: number, date: string) => {
    const { data } = await supabase.from('drink_counters').insert({ date, drink_id: drinkId, count: 1 }).select()
    if (data && data.length > 0) {
      drinkCounters.value.push(data[0])
      return data[0]
    }
    return -1
  }

  return {
    drinkCounters,
    findDrinkCountersById,
    findDrinkCountersByDrinkId,
    fetchDrinkCounters,
    fetchDrinkCountersPerMonth,
    fetchDrinkCountersForDay,
    increment,
    decrement,
    create,
  }
})
