import { DrinkCounterDomain } from '~/utils/domain/drinkCounters'

export function useIndexActions () {
  const { date, numberOfDrinks, labelsWithDrinks, drinkCountForDay, drinkCounters } = useIndexState()
  const { findNumberOfDrinkByDrinkId, findNumberOfDrinkByLabels, findLabelsWithDrinks, countForDay } = useIndexGetters()

  const { processIntoString } = useProcessDate()

  const { $drinkCountersRepository } = useNuxtApp()
  const { calcDate } = useUserStore()
  const drinkLabelsStore = useDrinkLabelsStore()
  const { findByVisible, updateDefaultDrinkId } = drinkLabelsStore
  const drinksStore = useDrinksStore()
  const { findDrinksVisible } = drinksStore
  const activityLogStore = useActivityLogStore()
  const { addActivity } = activityLogStore

  const setToday = () => {
    date.value = calcDate()
  }

  const prevDate = () => {
    const newDate = new Date(date.value)
    newDate.setDate(newDate.getDate() - 1)
    date.value = processIntoString(newDate)
  }

  const nextDate = () => {
    const newDate = new Date(date.value)
    newDate.setDate(newDate.getDate() + 1)
    date.value = processIntoString(newDate)
  }

  /**
   * dateの日付の飲んだ杯数を取得する
   */
  const fetchNumberOfDrinks = async () => {
    drinkCounters.value = await $drinkCountersRepository.fetchByDate(date.value)

    numberOfDrinks.value = []
    labelsWithDrinks.value = []
    drinkCountForDay.value = 0

    // visible = trueの飲み物を取得し、それに紐づくdrinkCountersを取得。（当日）
    // numberOfDrinksの形式で保存。
    try {
      for (const drink of findDrinksVisible()) {
        const drinkCounter = DrinkCounterDomain.findByDrinkId(drinkCounters.value, drink.id)
        numberOfDrinks.value.push({
          id: drink.id,
          name: drink.name,
          count: drinkCounter?.count ?? 0,
          color: drink.color ?? drink.default_color,
          drinkCounterId: drinkCounter?.id ?? -1,
          drinkLabelId: drink.drink_label_id,
        })
      }
    } catch {
      throw new CustomError(LOCALE_ERROR_UNKNOWN)
    }

    // visible = trueのdrinkLablesを取得し、そのラベルに紐づく飲み物を取得。
    // default_drink_idがnullだったら登録する
    for (const label of findByVisible()) {
      const drinks = findNumberOfDrinkByLabels(label.id)
      const labelWithDrinks = {
        ...label,
        drinks,
        currentDrink: (
          label.default_drink_id
            ? findNumberOfDrinkByDrinkId(label.default_drink_id)
            : null
        ) || drinks[0] || null,
      }

      // default_drink_idがnullだったら登録する
      if (!labelWithDrinks.default_drink_id) {
        const drink = drinks[0]
        if (drink) {
          await updateDefaultDrinkId(labelWithDrinks.id, drink.id, labelWithDrinks.name)
          labelWithDrinks.default_drink_id = drink.id
          labelWithDrinks.currentDrink = drink
        }
      }

      labelsWithDrinks.value.push(labelWithDrinks)
    }

    drinkCountForDay.value = countForDay()
  }

  const plus = async (drinkId: number, drinkCounterId: number) => {
    const numberOfDrink = findNumberOfDrinkByDrinkId(drinkId)
    if (drinkCounterId === -1) {
      // レコードがなければ作成する
      const newDrinkCounter = await $drinkCountersRepository.create(drinkId, date.value)
      // DrinkCounterId更新
      numberOfDrink!.drinkCounterId = newDrinkCounter.id
    } else {
      await $drinkCountersRepository.increment(drinkCounterId)
    }

    numberOfDrink!.count++
    drinkCountForDay.value++

    // Log the activity
    addActivity('plus', numberOfDrink!.name)
  }

  const minus = async (drinkId: number, drinkCounterId: number) => {
    // レコードがなければ何もしない
    if (drinkCounterId === -1) {
      return
    }
    const numberOfDrink = findNumberOfDrinkByDrinkId(drinkId)
    // レコードが取れない or 杯数が0だったら何もしない
    if (numberOfDrink === undefined || numberOfDrink.count === 0) {
      return
    }
    await $drinkCountersRepository.decrement(drinkCounterId)

    numberOfDrink!.count--
    drinkCountForDay.value--

    // Log the activity
    addActivity('minus', numberOfDrink!.name)
  }

  const updateDefaultDrink = (labelId: number, drinkId: number) => {
    const labelWithDrinks = findLabelsWithDrinks(labelId)
    if (!labelWithDrinks) {
      throw new GetRecordError()
    }
    const drink = labelWithDrinks.drinks.find(lwd => lwd.id === drinkId)
    if (!drink) {
      throw new GetRecordError()
    }
    updateDefaultDrinkId(labelId, drink.id, drink.name)
    labelWithDrinks.currentDrink = drink
  }

  return {
    setToday,
    prevDate,
    nextDate,
    fetchNumberOfDrinks,
    plus,
    minus,
    updateDefaultDrink,
  }
}
