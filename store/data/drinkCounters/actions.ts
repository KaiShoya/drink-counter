const TABLE_NAME = 'drink_counters'

export function useDrinkCountersActions () {
  const { supabase } = useSupabaseStore()
  const { drinkCounters } = useDrinkCountersState()
  const { findDrinkCountersById } = useDrinkCountersGetters()

  /**
   * 自分のデータを全件取得する
   */
  const fetchDrinkCounters = async () => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('date,drink_id').gt('count', 0)
    if (error) {
      throw new Response500Error()
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
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('date,drink_id').gt('count', 0).gte('date', minDate).lte('date', maxDate)
    if (error) {
      throw new Response500Error()
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
    const { data, error } = await supabase.from(TABLE_NAME).select('*').order('date,drink_id').gt('count', 0).gte('date', `${year}-${month}-01`).lt('date', `${nextYearMonth.year}-${nextYearMonth.month}-01`)
    if (error) {
      throw new Response500Error()
    }
    drinkCounters.value = data ?? []
  }

  /**
   * 指定した日付(string)の自分のデータを取得する
   * @param date 日付 '2023-01-01'
   */
  const fetchDrinkCountersForDay = async (date: string) => {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('date', date)
    if (error) {
      throw new Response500Error()
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
      throw new GetRecordError()
    }
    const { data, error } = await supabase.rpc('increment', { row_id: id })
    if (error) {
      throw new Response500Error()
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
      throw new GetRecordError()
    }
    if (drinkCounter.count <= 0) {
      return
    }
    const { data, error } = await supabase.rpc('decrement', { row_id: id })
    if (error) {
      throw new Response500Error()
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
    const { data, error } = await supabase.from(TABLE_NAME).insert({ date, drink_id: drinkId, count: 1 }).select()
    if (error) {
      throw new Response500Error()
    }
    if (data && data.length > 0) {
      drinkCounters.value.push(data[0])
      return Number(data[0].id)
    }
    return -1
  }

  return {
    fetchDrinkCounters,
    fetchDrinkCountersPerYear,
    fetchDrinkCountersPerMonth,
    fetchDrinkCountersForDay,
    increment,
    decrement,
    create,
  }
}
