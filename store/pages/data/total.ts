import { storeToRefs } from 'pinia'

import { useSupabaseStore } from '~/store/supabase'
import { useDrinkCountersStore } from '~/store/data/drinkCounters'
import { useDrinksStore } from '~/store/data/drinks'

export const useTotalStore = defineStore('totalStore', () => {
  const { supabase } = useSupabaseStore()
  const { formatDrinkCounters } = useProcessDate()
  const drinkCountersStore = useDrinkCountersStore()
  const { drinkCounters } = storeToRefs(drinkCountersStore)
  const { fetchDrinkCounters } = drinkCountersStore
  const drinksStore = useDrinksStore()
  const { drinks, getDrinksIdArray } = storeToRefs(drinksStore)
  const { fetchDrinks } = drinksStore

  const chartDataTitle = useState(() => ['Name', 'Count'])
  const sumCount: Ref<Array<{ drink_id: number, count: number }>> = useState(() => [])

  const fetchDrinkCountersAll = async () => {
    await fetchDrinks()
    await fetchDrinkCounters()
    await fetchSumCount()
  }

  const fetchSumCount = async () => {
    const { data } = await supabase.rpc('sum_count')
    sumCount.value = data ?? []
  }

  /**
   * カレンダー用データ
   */
  const computeCalendarData = computed(() => {
    return [
      [
        {
          type: 'date',
          id: 'Date',
        },
        {
          type: 'number',
          id: 'Count',
        },
      ],
      ...Object.entries(formatDrinkCounters(drinkCounters.value, getDrinksIdArray.value)).map(([key, value]) => [new Date(key), value[0]]),
    ]
  })

  /**
   * テーブル用データ（円グラフでも利用）
   */
  const computedTableData = computed(() => {
    return sumCount.value.map(
      (v: { drink_id: number, count: number }) => [
        drinks.value.find(drink => drink.id === v.drink_id)!.name,
        v.count,
      ],
    )
  })

  /**
   * 円グラフ用データ
   */
  const computedChartData = computed(() => {
    return [chartDataTitle.value, ...computedTableData.value]
  })

  return {
    chartDataTitle,
    fetchDrinkCountersAll,
    computeCalendarData,
    computedTableData,
    computedChartData,
  }
})
