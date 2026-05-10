<spec lang="md">
# Monthly Data Page
月次集計と可視化を表示するページ。
Loading / Empty / Error を共通ステートUIで統一し、再試行導線を提供する。

## Data
- useMonthlyStore: 既存チャート用データ（`yearMonth`, `computeCalendarData`, `computeGraphData` など）
- useMonthlySummaryStore: KPI と dense calendar
- local state: `isFetching`, `isFetched`, `fetchError`

## Interactions
- 初回表示時と `yearMonth/timezone/switching_timing` 変更時に再取得
- Error 状態で再試行
- Empty 状態で `/` へ遷移する CTA を表示

## Features
- 状態に応じてチャート群を出し分ける
- 取得成功時のみ KPI/チャートを表示する

## Error Handling
- 取得例外を `fetchError` で保持し、`logger.error` に記録

## i18n
- 状態文言は `data.state.*` を利用
</spec>

<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_MONTHLY),
})

// 既存ページは旧monthlyStoreを使用しているが、新しい月次集計も併用して試せるように追加
const monthlyStore = useMonthlyStore()
const { yearMonth, computeCalendarData, computeGraphData, computedChartOptions } = storeToRefs(monthlyStore)
const { fetchDrinkCounters } = monthlyStore

// 新しい月次集計ストア
const monthlySummary = useMonthlySummaryStore()
const { data: monthlyData } = storeToRefs(monthlySummary)
const { userSetting } = storeToRefs(useUserStore())
const isFetching = ref<boolean>(false)
const isFetched = ref<boolean>(false)
const fetchError = ref<string | null>(null)
const isRefreshInFlight = ref<boolean>(false)
const shouldRerunAfterFinish = ref<boolean>(false)

const monthlySummaryConditions = computed(() => ({
  timezone: userSetting.value.timezone,
  dayCutoffHour: userSetting.value.switching_timing,
  filters: { visibility: 'visible' as const },
}))

// カレンダー再描画用
const updateCalendar = ref<number>(0)

const pageMode = computed(() => {
  return resolveDataPageMode({
    isFetching: isFetching.value,
    isFetched: isFetched.value,
    hasError: Boolean(fetchError.value),
    totalCount: monthlyData.value?.kpi.totalDrinks ?? 0,
  })
})

const fetchMonthlySummary = async () => {
  await monthlySummary.fetchMonthlySummary({
    month: yearMonth.value,
    ...monthlySummaryConditions.value,
  })
}

const refreshPageData = async () => {
  if (isRefreshInFlight.value) {
    shouldRerunAfterFinish.value = true
    return
  }

  isRefreshInFlight.value = true
  shouldRerunAfterFinish.value = false
  isFetching.value = true
  fetchError.value = null
  try {
    await fetchDrinkCounters()
    await fetchMonthlySummary()
    if (monthlySummary.error) {
      throw new Error(monthlySummary.error)
    }
  } catch (error) {
    fetchError.value = error instanceof Error ? error.message : String(error)
    logger.error('Failed to fetch monthly data page', { module: 'pages/data/monthly.vue' }, error)
  } finally {
    isFetching.value = false
    isFetched.value = true
    updateCalendar.value++
    isRefreshInFlight.value = false

    if (shouldRerunAfterFinish.value) {
      shouldRerunAfterFinish.value = false
      void refreshPageData()
    }
  }
}

const moveToRecordingPage = async () => {
  await navigateTo('/')
}

refreshPageData()

watch([
  yearMonth,
  () => userSetting.value.timezone,
  () => userSetting.value.switching_timing,
], async () => {
  await refreshPageData()
})

// 型安全のため、count を number に正規化
const calendarDataNormalized = computed(() => {
  if (monthlyData.value?.calendar) {
    return monthlyData.value.calendar.map(c => ({
      date: c.date,
      count: c.count,
      overGoal: c.overGoal ?? false
    }))
  }
  return computeCalendarData.value.map(d => ({ date: d.date, count: d.count ?? 0, overGoal: false }))
})
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesMonthPicker />

    <div class="notification is-light py-3 px-4">
      <p>{{ t(LOCALE_SETTINGS_TIMEZONE) }}: {{ userSetting.timezone }}</p>
      <p>{{ t(LOCALE_SETTINGS_SWITCHING_TIMING) }}: {{ userSetting.switching_timing }} {{ t(LOCALE_SETTINGS_OCLOCK) }}</p>
    </div>

    <DomainChartMoleculesDataState
      v-if="pageMode === 'loading'"
      mode="loading"
      :show-action="false"
    />
    <DomainChartMoleculesDataState
      v-else-if="pageMode === 'error'"
      mode="error"
      @action="refreshPageData"
    />
    <DomainChartMoleculesDataState
      v-else-if="pageMode === 'empty'"
      mode="empty"
      @action="moveToRecordingPage"
    />

    <template v-else>
      <DomainMonthlyKpiCards />

      <DomainChartAtomsFCalendar
        :key="updateCalendar"
        :year-month="yearMonth"
        :data="calendarDataNormalized"
      />
      <DomainChartAtomsComboChart
        :data="computeGraphData"
        :options="computedChartOptions"
      />

      <DomainChartAtomsPieChart />

      <DomainChartMoleculesAggregationByDrinksTable />

      <DomainChartMoleculesAggregationByDowChart />
      <DomainChartMoleculesAggregationByDowTable />
    </template>
  </div>
</template>
