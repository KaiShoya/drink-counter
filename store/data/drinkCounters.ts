import { useSupabaseStore } from '~/store/supabase'
import type { DrinkCounter } from '~/store/data/types/drinkCounter'

export const useDrinkCountersStore = defineStore('drinkCountersStore', () => {
  const { supabase } = useSupabaseStore()
  const drinkCounters = ref<DrinkCounter[]>([])

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
    const { data, error } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0)
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinkCounters.value = data ?? []
  }

  /**
   * 指定した年の自分のデータを取得する
   * @param year 年
   */
  const fetchDrinkCountersPerYear = async (year: number) => {
    const minDate = `${year}-01-01`
    const maxDate = `${year}-12-31`
    const { data, error } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0).gte('date', minDate).lte('date', maxDate)
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinkCounters.value = data ?? []
  }

  /**
   * 指定した月の自分のデータを取得する
   * @param year 年
   * @param month 月
   */
  const fetchDrinkCountersPerMonth = async (year: number, month: number) => {
    const { processIntoYearMonthAdd1Month } = useProcessDate()
    const nextYearMonth = processIntoYearMonthAdd1Month(year, month)
    const { data, error } = await supabase.from('drink_counters').select('*').order('date,drink_id').gt('count', 0).gte('date', `${year}-${month}-01`).lt('date', `${nextYearMonth.year}-${nextYearMonth.month}-01`)
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinkCounters.value = data ?? []
  }

  /**
   * 指定した日付(string)の自分のデータを取得する
   * @param date 日付 '2023-01-01'
   */
  const fetchDrinkCountersForDay = async (date: string) => {
    const { data, error } = await supabase.from('drink_counters').select('*').eq('date', date)
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinkCounters.value = data ?? []
  }

  /**
   * 指定したレコードを+1する
   * @param id drinkCounter.id
   * return error_message | undefined
   */
  const increment = async (id: number) => {
    const drinkCounter = findDrinkCountersById(id)
    if (!drinkCounter) {
      return 'error.GET_RECORD'
    }
    const { data, error } = await supabase.rpc('increment', { row_id: id })
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinkCounter.count = Number(data) ?? 0
  }

  /**
   * 指定したレコードを-1する
   * @param id drinkCounter.id
   * return error_message | undefined
   */
  const decrement = async (id: number) => {
    const drinkCounter = findDrinkCountersById(id)
    if (!drinkCounter) {
      return 'error.GET_RECORD'
    }
    if (drinkCounter.count <= 0) {
      return
    }
    const { data, error } = await supabase.rpc('decrement', { row_id: id })
    if (error) {
      return 'error.500_API_ERROR'
    }
    drinkCounter.count = Number(data) ?? 0
  }

  /**
   * 指定した日付のレコードを作成する
   * @param drinkId drink.id
   * @param date 日付 '2023-01-01'
   * @return drink_counter_id | error_message
   */
  const create = async (drinkId: number, date: string) => {
    const { data, error } = await supabase.from('drink_counters').insert({ date, drink_id: drinkId, count: 1 }).select()
    if (error) {
      return 'error.500_API_ERROR'
    }
    if (data && data.length > 0) {
      drinkCounters.value.push(data[0])
      return Number(data[0].id)
    }
    return -1
  }

  return {
    drinkCounters,
    findDrinkCountersById,
    findDrinkCountersByDrinkId,
    fetchDrinkCounters,
    fetchDrinkCountersPerYear,
    fetchDrinkCountersPerMonth,
    fetchDrinkCountersForDay,
    increment,
    decrement,
    create,
  }
})
