import { findTimeZone, getZonedTime } from 'timezone-support'
import { formatZonedTime } from 'timezone-support/parse-format'

export function useIndexActions () {
  const { date, numberOfDrinks, labelsWithDrinks, drinkCountForDay } = useIndexState()
  const { findNumberOfDrinkByDrinkId, findNumberOfDrinkByLabels, findLabelsWithDrinks, updateDrinkCountForDay } = useIndexGetters()

  const { processIntoString } = useProcessDate()

  const { showLoading, hideLoading } = useAppStore()
  const drinksStore = useDrinksStore()
  const { fetchDrinks, findDrinksVisible } = drinksStore
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCountersForDay, findDrinkCountersByDrinkId, increment, decrement, create } = drinkCountersStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, findByVisible, updateDefaultDrinkId } = drinkLabelsStore
  const userSettingsStore = useUserSettingsStore()
  const { userSettings } = storeToRefs(userSettingsStore)

  /**
   * 日付を取得する
   */
  const fetchDate = () => {
    // TODO: 日付計算はuserSettingsStoreの方が良い？
    const tz = findTimeZone(userSettings.value.timezone)
    const nativeDate = new Date()
    const tzTime = getZonedTime(nativeDate, tz)

    // 現在時刻が設定時刻を超えない場合、日付を-1する（0時過ぎても前日の日付でカウントするため）
    if (tzTime.hours < userSettings.value.switchingTiming) {
      tzTime.day = tzTime.day - 1
    }
    const displayTime = formatZonedTime(tzTime, 'YYYY-MM-DD')
    date.value = displayTime
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
   * 指定した日付の飲んだ杯数を取得する
   * @param date 日付 '2023-01-01'
   */
  const fetchNumberOfDrinks = async (date: string) => {
    showLoading()
    await fetchDrinkLabels()
    await fetchDrinks()
    await fetchDrinkCountersForDay(date)

    numberOfDrinks.value = []
    labelsWithDrinks.value = []
    drinkCountForDay.value = 0

    try {
      for (const drink of findDrinksVisible()) {
        const drinkCounter = findDrinkCountersByDrinkId(drink.id)
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

    for (const label of findByVisible()) {
      const drinks = findNumberOfDrinkByLabels(label.id)
      const labelWithDrinks = {
        ...label,
        drinks,
        currentDrink: (label.default_drink_id ? findNumberOfDrinkByDrinkId(label.default_drink_id) : null) || drinks[0] || null,
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

    drinkCountForDay.value = updateDrinkCountForDay()

    hideLoading()
  }

  const plus = async (drinkId: number, drinkCounterId: number) => {
    const numberOfDrink = findNumberOfDrinkByDrinkId(drinkId)
    if (drinkCounterId === -1) {
      // レコードがなければ作成する
      const newDrinkCounterId = await create(drinkId, date.value)
      // DrinkCounterId更新
      numberOfDrink!.drinkCounterId = newDrinkCounterId
    } else {
      await increment(drinkCounterId)
    }

    const drinkCounter = findDrinkCountersByDrinkId(drinkId)
    numberOfDrink!.count = drinkCounter!.count
    drinkCountForDay.value = updateDrinkCountForDay()
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
    await decrement(drinkCounterId)

    const drinkCounter = findDrinkCountersByDrinkId(drinkId)
    numberOfDrink!.count = drinkCounter!.count
    drinkCountForDay.value = updateDrinkCountForDay()
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
    updateDefaultDrinkId(labelWithDrinks.id, drink.id, labelWithDrinks.name)
    labelWithDrinks.currentDrink = drink
  }

  return {
    fetchDate,
    prevDate,
    nextDate,
    fetchNumberOfDrinks,
    plus,
    minus,
    updateDefaultDrink,
  }
}
