import { storeToRefs } from 'pinia'
import { findTimeZone, getZonedTime } from 'timezone-support'
import { formatZonedTime } from 'timezone-support/parse-format'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'
import { useUserSettingsStore } from '~/store/data/userSettings'
import type { NumberOfDrink, DrinkLabelWithDrinks } from '~/store/types/numberOfDrink'

export const useIndexStore = defineStore('numberOfDrinksStore', () => {
  const { $i18n } = useNuxtApp()
  const { processIntoString } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { fetchDrinkCountersForDay, findDrinkCountersByDrinkId, increment, decrement, create } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { fetchDrinks, findDrinksVisible } = drinksStore
  const drinkLabelsStore = useDrinkLabelsStore()
  const { fetchDrinkLabels, findByVisible, updateDefaultDrinkId } = drinkLabelsStore
  const userSettingsStore = useUserSettingsStore()
  const { userSettings } = storeToRefs(userSettingsStore)

  const date = ref<string>('')
  const numberOfDrinks = ref<NumberOfDrink[]>([])
  const labelsWithDrinks = ref<DrinkLabelWithDrinks[]>([])
  const drinkCountForDay = ref<number>(0)
  const isLoading = ref<boolean>(false)

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

  const findNumberOfDrinkByDrinkId = (drinkId: number) => {
    return numberOfDrinks.value.find(nod => nod.id === drinkId)
  }
  // const findNumberOfDrinkByDrinkCounterId = (drinkCounterId: number) => {
  //   return numberOfDrinks.value.find(nod => nod.drinkCounterId === drinkCounterId)
  // }

  const findNumberOfDrinkByLabels = (labelId: number) => {
    return numberOfDrinks.value.filter(nod => nod.drinkLabelId === labelId)
  }

  const findLabelsWithDrinks = (labelId: number) => {
    return labelsWithDrinks.value.find(lwd => lwd.id === labelId)
  }

  /**
   * numberOfDrinksのcountの合計値を返却する
   * @returns number 1日の合計数
   */
  const updateDrinkCountForDay = () => numberOfDrinks.value.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)

  /**
   * 指定した日付の飲んだ杯数を取得する
   * @param date 日付 '2023-01-01'
   */
  const fetchNumberOfDrinks = async (date: string) => {
    isLoading.value = true
    try {
      const fetchDrinkLabelsError = await fetchDrinkLabels()
      if (fetchDrinkLabelsError) {
        showDangerToast($i18n.t(fetchDrinkLabelsError))
        return
      }

      const fetchDrinksError = await fetchDrinks()
      if (fetchDrinksError) {
        showDangerToast($i18n.t(fetchDrinksError))
        return
      }

      const fetchDrinkCountersForDayError = await fetchDrinkCountersForDay(date)
      if (fetchDrinkCountersForDayError) {
        showDangerToast($i18n.t(fetchDrinkCountersForDayError))
        return
      }

      numberOfDrinks.value = []
      labelsWithDrinks.value = []
      drinkCountForDay.value = 0

      findDrinksVisible().forEach((drink) => {
        const drinkCounter = findDrinkCountersByDrinkId(drink.id)
        numberOfDrinks.value.push({
          id: drink.id,
          name: drink.name,
          count: drinkCounter?.count ?? 0,
          color: drink.color ?? drink.default_color,
          drinkCounterId: drinkCounter?.id ?? -1,
          drinkLabelId: drink.drink_label_id,
        })
      })

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
            const error = await updateDefaultDrinkId(labelWithDrinks.id, drink.id)
            if (error) {
              showWarningToast($i18n.t(error) + `: ${labelWithDrinks.name}`)
            }
            labelWithDrinks.default_drink_id = drink.id
            labelWithDrinks.currentDrink = drink
          }
        }

        labelsWithDrinks.value.push(labelWithDrinks)
      }

      drinkCountForDay.value = updateDrinkCountForDay()
    } catch (error) {
      showDangerToast($i18n.t('error.UNKNOWN'))
    } finally {
      isLoading.value = false
    }
  }

  const plus = async (drinkId: number, drinkCounterId: number) => {
    const numberOfDrink = findNumberOfDrinkByDrinkId(drinkId)
    if (drinkCounterId === -1) {
      // レコードがなければ作成する
      const newDrinkCounterId = await create(drinkId, date.value)
      if (typeof newDrinkCounterId !== 'number') {
        showDangerToast($i18n.t(newDrinkCounterId))
        return
      }
      // DrinkCounterId更新
      numberOfDrink!.drinkCounterId = newDrinkCounterId
    } else {
      const incrementError = await increment(drinkCounterId)
      if (incrementError) {
        showDangerToast($i18n.t(incrementError))
      }
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
    const decrementError = await decrement(drinkCounterId)
    if (decrementError) {
      showDangerToast($i18n.t(decrementError))
    }

    const drinkCounter = findDrinkCountersByDrinkId(drinkId)
    numberOfDrink!.count = drinkCounter!.count
    drinkCountForDay.value = updateDrinkCountForDay()
  }

  // const updateCurrentDrink = (labelId: number, drink: NumberOfDrink) => {
  const updateDefaultDrink = async (labelId: number, drinkId: number) => {
    const labelWithDrinks = findLabelsWithDrinks(labelId)
    if (!labelWithDrinks) {
      showDangerToast($i18n.t('error.GET_RECORD'))
      return
    }
    const drink = labelWithDrinks.drinks.find(lwd => lwd.id === drinkId)
    if (!drink) {
      showDangerToast($i18n.t('error.GET_RECORD'))
      return
    }
    const error = await updateDefaultDrinkId(labelWithDrinks.id, drink.id)
    if (error) {
      showDangerToast($i18n.t(error) + `: ${labelWithDrinks.name}`)
      return
    }
    labelWithDrinks.currentDrink = drink
  }

  return {
    date,
    numberOfDrinks,
    labelsWithDrinks,
    drinkCountForDay,
    isLoading,
    fetchDate,
    prevDate,
    nextDate,
    fetchNumberOfDrinks,
    findNumberOfDrinkByLabels,
    plus,
    minus,
    updateDefaultDrink,
  }
})
