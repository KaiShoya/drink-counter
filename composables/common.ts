export const useProcessDate = () => {
  /**
   * DateオブジェクトをYYYY-MM形式に変換する
   * @param date Date
   * @returns string YYYY-MM
   */
  const processIntoYearMonth = (date: Date) => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}`
  return {
    processIntoYearMonth
  }
}
