import type { DrinkCounter } from '~/store/data/types/drinkCounter'

/**
 * DateオブジェクトをYYYY-MM-DD形式に変換する
 * @param date Date
 * @returns string YYYY-MM-DD
 */
const processIntoString = (date: Date) => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`

/**
 * DateオブジェクトをYYYY-MM形式に変換する
 * @param date Date
 * @returns string YYYY-MM
 */
const processIntoYearMonth = (date: Date) => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`

/**
 * カレンダー、棒グラフで利用できる形にデータを整形する
 * @param drinkCounters
 * @param getDrinksIdArray
 * @returns
 */
const formatDrinkCounters = (drinkCounters: Array<DrinkCounter>, getDrinksIdArray: Array<number>) => {
  const data: { [key: string]: Array<number> } = {}

  drinkCounters.forEach((drinkCounter) => {
    if (!Object.getOwnPropertyDescriptor(data, drinkCounter.date)) {
      // 配列初期化
      data[drinkCounter.date] = new Array(getDrinksIdArray.length + 1)
      data[drinkCounter.date].fill(0)
    }
    data[drinkCounter.date][getDrinksIdArray.indexOf(drinkCounter.drink_id) + 1] = drinkCounter.count
    data[drinkCounter.date][0] += drinkCounter.count
  })
  return data
}

export const useProcessDate = () => {
  return {
    processIntoString,
    processIntoYearMonth,
    formatDrinkCounters,
  }
}
