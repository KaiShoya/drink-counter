const LOCALE_PREFIX = 'timezone.'

export type Timezone = {
  timezone: string
  localeName: string // 現在は未使用
}

export const TIMEZONE: Array<Timezone> = [
  {
    timezone: 'UTC',
    localeName: LOCALE_PREFIX + 'UTC',
  },
  {
    timezone: 'Asia/Tokyo',
    localeName: LOCALE_PREFIX + 'Asia/Tokyo',
  },
]
