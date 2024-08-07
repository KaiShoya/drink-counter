const year = ref<number>((new Date()).getFullYear())

// カレンダー用データ
const calendarTitle = ref<Array<{ type: string, id: string }>>([
  {
    type: 'date',
    id: 'Date',
  },
  {
    type: 'number',
    id: 'Count',
  },
])

export const useAnnualState = () => {
  return {
    year,
    calendarTitle,
  }
}
