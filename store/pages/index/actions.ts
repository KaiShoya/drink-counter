import { findTimeZone, getZonedTime, convertTimeToDate } from 'timezone-support'
import { formatZonedTime } from 'timezone-support/parse-format'
import { DrinkCounterDomain } from '~/utils/domain/drinkCounters'
import { DrinkLabelDomain } from '~/utils/domain/drinkLabels'
import { DrinkDomain } from '~/utils/domain/drinks'

export function useIndexActions () {
  const { date, numberOfDrinks, labelsWithDrinks, drinkCountForDay, drinks, drinkCounters, drinkLabels } = useIndexState()
  const { findNumberOfDrinkByDrinkId, findNumberOfDrinkByLabels, findLabelsWithDrinks, countForDay } = useIndexGetters()

  const { processIntoString } = useProcessDate()

  const { $drinksRepository, $drinkCountersRepository, $drinkLabelsRepository } = useNuxtApp()
  const { showLoading, hideLoading } = useAppStore()
  const { userSetting } = storeToRefs(useUserStore())

  /**
   * 日付を取得する
   */
  const fetchDate = () => {
    // TODO: 日付計算はuserSettingsStoreの方が良い？
    const tz = findTimeZone(userSetting.value.timezone)
    const nativeDate = new Date()
    let tzTime = getZonedTime(nativeDate, tz)

    // 現在時刻が設定時刻を超えない場合、日付を-1する（0時過ぎても前日の日付でカウントするため）
    if (tzTime.hours < userSetting.value.switching_timing) {
      const date = convertTimeToDate(tzTime)
      date.setDate(date.getDate() - 1)
      tzTime = getZonedTime(date, tz)
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

    drinkLabels.value = await $drinkLabelsRepository.fetchAll()
    drinks.value = await $drinksRepository.fetchAll()
    drinkCounters.value = await $drinkCountersRepository.fetchByDate(date)

    numberOfDrinks.value = []
    labelsWithDrinks.value = []
    drinkCountForDay.value = 0

    // visible = trueの飲み物を取得し、それに紐づくdrinkCountersを取得。（当日）
    // numberOfDrinksの形式で保存。
    try {
      for (const drink of DrinkDomain.findVisible(drinks.value)) {
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
    for (const label of DrinkLabelDomain.findVisible(drinkLabels.value)) {
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
          await $drinkLabelsRepository.updateDefaultDrinkId(labelWithDrinks.id, drink.id, labelWithDrinks.name)
          labelWithDrinks.default_drink_id = drink.id
          labelWithDrinks.currentDrink = drink
        }
      }

      labelsWithDrinks.value.push(labelWithDrinks)
    }

    drinkCountForDay.value = countForDay()

    hideLoading()
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

    const drinkCounter = DrinkCounterDomain.findByDrinkId(drinkCounters.value, drinkId)
    numberOfDrink!.count = drinkCounter!.count
    drinkCountForDay.value = countForDay()
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

    const drinkCounter = DrinkCounterDomain.findByDrinkId(drinkCounters.value, drinkId)
    numberOfDrink!.count = drinkCounter!.count
    drinkCountForDay.value = countForDay()
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
    $drinkLabelsRepository.updateDefaultDrinkId(labelWithDrinks.id, drink.id, labelWithDrinks.name)
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
