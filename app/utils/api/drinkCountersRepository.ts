import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/../database.types'

const TABLE_NAME = 'drink_counters' as const

export type DrinkCounterRow = Database['public']['Tables'][typeof TABLE_NAME]['Row']

export interface DrinkCountersRepository {
  fetchAll(): Promise<DrinkCounterRow[]>
  fetchByYear(year: number): Promise<DrinkCounterRow[]>
  fetchByMonth(year: number, month: number): Promise<DrinkCounterRow[]>
  fetchByDate(date: string): Promise<DrinkCounterRow[]>
  increment(id: number): Promise<number>
  decrement(id: number): Promise<number>
  create(drinkId: number, date: string): Promise<DrinkCounterRow>
}

const { yearMonthToDateString, processIntoYearMonthToNextMonth } = useProcessDate()

// /** Repository abstraction for drink counter aggregation workflows. */
// export interface DrinkCountersRepository {
//   fetchAll (): Promise<DrinkCounterRow[]>
//   fetchByDateRange (params: FetchByDateRangeParams): Promise<DrinkCounterRow[]>
//   fetchByMonth (year: number, month: number): Promise<DrinkCounterRow[]>
// }

export const createDrinkCountersRepository = (
  client: SupabaseClient<Database>,
): DrinkCountersRepository => {
  /**
   * 自分のデータを全件取得する
   * @return {Promise<DrinkCounterRow[]>}
   */
  const fetchAll = async (): Promise<DrinkCounterRow[]> => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('date,drink_id')
      .gt('count', 0)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    return data ?? []
  }

  /**
   * 指定した年の自分のデータを取得する
   * @param year 年
   * @return {Promise<DrinkCounterRow[]>}
   */
  const fetchByYear = async (year: number): Promise<DrinkCounterRow[]> => {
    const minDate = `${year}-01-01`
    const maxDate = `${year}-12-31`
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('date,drink_id')
      .gt('count', 0)
      .gte('date', minDate)
      .lte('date', maxDate)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    return data ?? []
  }

  /**
   * 指定した月の自分のデータを取得する
   * @param year 年
   * @param month 月
   * @return {Promise<DrinkCounterRow[]>}
   */
  const fetchByMonth = async (year: number, month: number): Promise<DrinkCounterRow[]> => {
    const start = yearMonthToDateString(year, month)
    const nextYearMonth = processIntoYearMonthToNextMonth(year, month)
    const end = yearMonthToDateString(nextYearMonth.year, nextYearMonth.month)
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('date,drink_id')
      .gt('count', 0)
      .gte('date', start)
      .lt('date', end)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    return data ?? []
  }

  /**
   * 指定した日付(string)の自分のデータを取得する
   * @param date 日付 '2023-01-01'
   * @return {Promise<DrinkCounterRow[]>}
   */
  const fetchByDate = async (date: string): Promise<DrinkCounterRow[]> => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .eq('date', date)

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_GET_RECORD)
    }

    return data ?? []
  }

  /**
   * 指定したレコードを+1する
   * @param id drinkCounter.id
   * @returns {Promise<number>} 更新後のカウント数
   */
  const increment = async (id: number): Promise<number> => {
    const { data, error } = await client.rpc('increment', { row_id: id })

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
    }

    return isNaN(data) ? 0 : Number(data)
  }

  /**
   * 指定したレコードを-1する
   * @param id drinkCounter.id
   * @returns {Promise<number>} 更新後のカウント数
   */
  const decrement = async (id: number): Promise<number> => {
    const { data, error } = await client.rpc('decrement', { row_id: id })
    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
    }
    return isNaN(data) ? 0 : Number(data)
  }

  /**
   * 指定した日付のレコードを作成する
   * @param drinkId drink.id
   * @param date 日付 '2023-01-01'
   * @return {Promise<DrinkCounterRow>}
   */
  const create = async (drinkId: number, date: string): Promise<DrinkCounterRow> => {
    const { data, error } = await client
      .from(TABLE_NAME)
      .insert({ date, drink_id: drinkId, count: 1 })
      .select('*')
      .single()

    if (error) {
      throw new SupabaseResponseError(error, LOCALE_ERROR_UNKNOWN)
    }

    return data
  }

  return {
    fetchAll,
    fetchByYear,
    fetchByMonth,
    fetchByDate,
    increment,
    decrement,
    create,
  }
}
