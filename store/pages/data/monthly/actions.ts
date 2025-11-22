import { DrinkDomain } from "~/utils/domain/drinks"

export const useMonthlyActions = () => {
  const { yearMonth, graphDataTitleBase, graphDataTitle, drinks, drinkCounters, aggregationByDrinks, aggregationByDow } = useMonthlyState()
  const { computedYearMonth } = useMonthlyGetters()

  const { yearMonthToString, processIntoYearMonthToPrevMonth, processIntoYearMonthToNextMonth } = useProcessDate()

  const { $drinksRepository, $drinkCountersRepository, $drinkLabelsRepository } = useNuxtApp()  
  const { showLoading, hideLoading } = useAppStore()

  const prevMonth = () => {
    const { year, month } = computedYearMonth.value
    if (year === undefined || month === undefined) {
      throw new CustomError('年月の取得に失敗しました')
    }

    const { year: prevYear, month: prevMonth } = processIntoYearMonthToPrevMonth(year, month)
    yearMonth.value = yearMonthToString(prevYear, prevMonth)
  }

  const nextMonth = () => {
    const { year, month } = computedYearMonth.value
    if (year === undefined || month === undefined) {
      throw new CustomError('年月の取得に失敗しました')
    }

    const { year: nextYear, month: nextMonth } = processIntoYearMonthToNextMonth(year, month)
    yearMonth.value = yearMonthToString(nextYear, nextMonth)
  }

  const fetchDrinkCounters = async () => {
    showLoading()

    const { year, month } = computedYearMonth.value
    if (year === undefined || month === undefined) {
      throw new CustomError('年月の取得に失敗しました')
    }

    drinks.value = await $drinksRepository.fetchAll()
    drinkCounters.value = await $drinkCountersRepository.fetchByMonth(year, month)
    aggregationByDrinks.value = await $drinkLabelsRepository.fetchSumCountPerMonth(year, month)
    aggregationByDow.value = await $drinkCountersRepository.fetchAggregationByDowPerMonth(year, month)
    graphDataTitle.value = [
      ...graphDataTitleBase,
      ...DrinkDomain.extractNames(drinks.value),
    ]

    hideLoading()
  }

  return {
    prevMonth,
    nextMonth,
    fetchDrinkCounters,
  }
}
