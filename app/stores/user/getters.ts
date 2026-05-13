import { createDefaultUserSetting, useUserState } from './state'
import { findTimeZone, getZonedTime, convertTimeToDate } from 'timezone-support'
import { formatZonedTime } from 'timezone-support/parse-format'

export function useUserGetters () {
  const { userSetting } = useUserState()

  const calcDate = (): string => {
    const currentSetting = userSetting.value ?? createDefaultUserSetting()
    const tz = findTimeZone(currentSetting.timezone)
    const nativeDate = new Date()
    let tzTime = getZonedTime(nativeDate, tz)

    // 現在時刻が設定時刻を超えない場合、日付を-1する（0時過ぎても前日の日付でカウントするため）
    if (tzTime.hours < currentSetting.switching_timing) {
      const date = convertTimeToDate(tzTime)
      date.setDate(date.getDate() - 1)
      tzTime = getZonedTime(date, tz)
    }
    const displayTime = formatZonedTime(tzTime, 'YYYY-MM-DD')
    return displayTime
  }

  return {
    calcDate,
  }
}
