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
 * 引数で渡したyear, monthに1ヶ月追加する
 * @param year 2023
 * @param month 12
 * @returns { year: 2024, month: 1 }
 */
const processIntoYearMonthAdd1Month = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  }
}

/**
 * カレンダー、棒グラフで利用できる形にデータを整形する
 * @param drinkCounters
 * @param getDrinksIdArray
 * @returns
 */
const formatDrinkCounters = (drinkCounters: Array<DrinkCounter>, getDrinksIdArray: Array<number>) => {
  const data: { [key: string]: Array<number> } = {}

  for (const drinkCounter of drinkCounters) {
    if (!Object.getOwnPropertyDescriptor(data, drinkCounter.date)) {
      // 配列初期化
      data[drinkCounter.date] = new Array(getDrinksIdArray.length + 1)
      data[drinkCounter.date].fill(0)
    }
    data[drinkCounter.date][getDrinksIdArray.indexOf(drinkCounter.drink_id) + 1] = drinkCounter.count
    data[drinkCounter.date][0] += drinkCounter.count
  }
  return data
}

export const useProcessDate = () => {
  return {
    processIntoString,
    processIntoYearMonth,
    processIntoYearMonthAdd1Month,
    formatDrinkCounters,
  }
}

/**
 * ランダムな色を生成する(RGB)
 * @returns string #000000
 */
export const generateRandomColor = () => {
  return '#' +
    ('00' + Math.floor(256 * Math.random()).toString(16)).slice(-2) +
    ('00' + Math.floor(256 * Math.random()).toString(16)).slice(-2) +
    ('00' + Math.floor(256 * Math.random()).toString(16)).slice(-2)
}

/**
 * 改行コード「\n」を<br>に変換する
 * @param message string
 * @returns string
 */
const replaceStrictLineBreaks = (message: string) => {
  const messages = message.split('\\n')
  return messages.join('<br>')
}

/**
 * 改行コード「\n」を<span>に変換する
 * @param message string
 * @returns string
 */
const replaceLooseLineBreaks = (message: string) => {
  const spanStart = '<span style="display: inline-block;">'
  const spanEnd = '</span>'
  const messages = message.split('\\n')
  return spanStart + spanStart + messages.join(spanEnd + spanStart) + spanEnd + spanEnd
}

/**
 * 配列を<br>で結合する
 * @param messages Array<string>
 * @returns string
 */
const joinStrictLineBreaks = (messages: Array<string>) => {
  return messages.join('<br>')
}

export const useProcessString = {
  replaceStrictLineBreaks,
  replaceLooseLineBreaks,
  joinStrictLineBreaks,
}
