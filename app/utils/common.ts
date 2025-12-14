import type { DrinkCounterRow as DrinkCounter } from '~/repositories/drinkCountersRepository'

/**
 * DateオブジェクトをYYYY-MM-DD形式に変換する
 * @param date Date
 * @returns string YYYY-MM-DD
 */
const processIntoString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * DateオブジェクトをYYYY-MM形式に変換する
 * @param date Date
 * @returns string YYYY-MM
 */
const processIntoYearMonth = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * 年月をYYYY-MM形式に変換する
 * @param year number
 * @param month number
 * @returns string YYYY-MM
 */
const yearMonthToString = (year: number, month: number) => {
  const date = new Date(year, month - 1, 1);
  const normalizedYear = date.getFullYear()
  const normalizedMonth = String(date.getMonth() + 1).padStart(2, '0')
  return `${normalizedYear}-${normalizedMonth}`
}

/**
 * 年月をYYYY-MM-DD形式に変換する
 * 日付は01固定
 * @param year number
 * @param month number
 * @returns string YYYY-MM-01
 */
const yearMonthToDateString = (year: number, month: number): string => {
  const date = new Date(year, month - 1, 1);
  const normalizedYear = date.getFullYear()
  const normalizedMonth = String(date.getMonth() + 1).padStart(2, '0')
  return `${normalizedYear}-${normalizedMonth}-01`
}

/**
 * 引数で渡したyear, monthの翌月を返却する
 * @param year 2023
 * @param month 12
 * @returns { year: 2024, month: 1 }
 */
const processIntoYearMonthToNextMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

/**
 * 引数で渡したyear, monthの前月を返却する
 * @param year 2023
 * @param month 12
 * @returns { year: 2023, month: 11 }
 */
const processIntoYearMonthToPrevMonth = (year: number, month: number) => {
  const date = new Date(year, month - 2, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

/**
 * カレンダー、棒グラフで利用できる形にデータを整形する
 * @param drinkCounters
 * @param getDrinksIdArray
 * @returns
 */
const formatDrinkCounters = (
  drinkCounters: Array<DrinkCounter>,
  getDrinksIdArray: Array<number>,
) => {
  const data: { [key: string]: Array<number> } = {};

  for (const drinkCounter of drinkCounters) {
    let row = data[drinkCounter.date]

    if (!row) {
      // 配列初期化
      row = new Array(getDrinksIdArray.length + 1).fill(0);
      data[drinkCounter.date] = row;
    }
    
    row[getDrinksIdArray.indexOf(drinkCounter.drink_id) + 1] = drinkCounter.count;
    // @ts-ignore: row is guaranteed to be initialized above
    row[0] += drinkCounter.count;
  }
  return data;
};

export const useProcessDate = () => {
  return {
    processIntoString,
    processIntoYearMonth,
    yearMonthToString,
    yearMonthToDateString,
    processIntoYearMonthToNextMonth,
    processIntoYearMonthToPrevMonth,
    formatDrinkCounters,
  };
};

/**
 * ランダムな色を生成する(RGB)
 * @returns string #000000
 */
export const generateRandomColor = () => {
  return (
    "#" +
    ("00" + Math.floor(256 * Math.random()).toString(16)).slice(-2) +
    ("00" + Math.floor(256 * Math.random()).toString(16)).slice(-2) +
    ("00" + Math.floor(256 * Math.random()).toString(16)).slice(-2)
  );
};

/**
 * 改行コード「\n」を<br>に変換する
 * @param message string
 * @returns string
 */
const replaceStrictLineBreaks = (message: string) => {
  const messages = message.split("\\n");
  return messages.join("<br>");
};

/**
 * 改行コード「\n」を<span>に変換する
 * @param message string
 * @returns string
 */
const replaceLooseLineBreaks = (message: string) => {
  const spanStart = '<span style="display: inline-block;">';
  const spanEnd = "</span>";
  const messages = message.split("\\n");
  return (
    spanStart +
    spanStart +
    messages.join(spanEnd + spanStart) +
    spanEnd +
    spanEnd
  );
};

/**
 * 配列を<br>で結合する
 * @param messages Array<string>
 * @returns string
 */
const joinStrictLineBreaks = (messages: Array<string>) => {
  return messages.join("<br>");
};

export const useProcessString = {
  replaceStrictLineBreaks,
  replaceLooseLineBreaks,
  joinStrictLineBreaks,
};
