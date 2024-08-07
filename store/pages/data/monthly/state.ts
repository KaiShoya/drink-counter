const { processIntoYearMonth } = useProcessDate()

const yearMonth = ref<string>(processIntoYearMonth(new Date()))
const graphDataTitleBase = ['日付', '合計']
const graphDataTitle = ref<string[]>(graphDataTitleBase)

export const useMonthlyState = () => {
  return {
    yearMonth,
    graphDataTitleBase,
    graphDataTitle,
  }
}
