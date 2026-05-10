<spec lang="md">
# Annual Data Page
年次集計を表示するページ。
Loading / Empty / Error の状態を共通UIで統一し、再試行導線を提供する。

## Data
- useAnnualStore: 既存集計ベースデータ
- useAnnualSummaryStore: 年次 KPI
- local state: `isFetching`, `isFetched`, `fetchError`

## Interactions
- 初回表示時と `year/timezone/switching_timing` 変更時に再取得
- Error 時に再試行
- Empty 時は `/` へ遷移する CTA を表示

## Features
- 統一ステートUIを優先し、データ取得成功時のみグラフ群を表示

## Error Handling
- 例外を `fetchError` に保持し、`logger.error` で追跡する

## i18n
- 状態文言は `data.state.*` を利用
</spec>

<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_ANNUAL),
})

const annualStore = useAnnualStore()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { year, calendarTitle, computeCalendarData } = storeToRefs(annualStore)
const { fetchDrinkCounters } = annualStore
const { userSetting } = storeToRefs(useUserStore())
const isFetching = ref<boolean>(false)
const isFetched = ref<boolean>(false)
const fetchError = ref<string | null>(null)

const annualSummaryConditions = computed(() => ({
  timezone: userSetting.value.timezone,
  dayCutoffHour: userSetting.value.switching_timing,
  filters: { visibility: 'visible' as const },
}))

// 年次KPIの新ストア
const annualSummary = useAnnualSummaryStore()
const pageMode = computed(() => {
  return resolveDataPageMode({
    isFetching: isFetching.value,
    isFetched: isFetched.value,
    hasError: Boolean(fetchError.value),
    totalCount: annualSummary.data?.kpi.totalDrinks ?? 0,
  })
})
const fetchAnnualSummary = async () => {
  await annualSummary.fetchAnnualSummary({
    year: year.value,
    ...annualSummaryConditions.value,
  })
}

const refreshPageData = async () => {
  isFetching.value = true
  fetchError.value = null
  try {
    await fetchDrinkCounters()
    await fetchAnnualSummary()
    if (annualSummary.error) {
      throw new Error(annualSummary.error)
    }
  } catch (error) {
    fetchError.value = error instanceof Error ? error.message : String(error)
    logger.error('Failed to fetch annual data page', { module: 'pages/data/annual.vue' }, error)
  } finally {
    isFetching.value = false
    isFetched.value = true
  }
}

const moveToRecordingPage = async () => {
  await navigateTo('/')
}

refreshPageData()

watch([
  year,
  () => userSetting.value.timezone,
  () => userSetting.value.switching_timing,
], async () => {
  await refreshPageData()
})
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesYearPicker />

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
      <DomainAnnualKpiCards />

      <!-- メモリリークするため一旦コメントアウト -->
      <!-- <MoleculesGraphsCalendar
        :title="calendarTitle"
        :data="computeCalendarData"
      /> -->

      <DomainChartAtomsPieChart />

      <DomainChartMoleculesAggregationByDrinksTable />

      <DomainChartMoleculesAggregationByDowTable />
    </template>
  </div>
</template>
