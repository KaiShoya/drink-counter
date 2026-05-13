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
- 月次レビュー（最多カテゴリ・曜日傾向・先月比）を表示する
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
const { drinkLabels } = storeToRefs(useDrinkLabelsStore())
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

const monthlyTopLabelSummary = computed(() => {
  const labels = monthlyData.value?.averages.byLabel ?? []
  if (labels.length === 0) return null

  const top = [...labels].sort((a, b) => b.sharePct - a.sharePct)[0]
  if (!top) return null

  const labelId = Number(top.labelId)
  const labelName = Number.isNaN(labelId)
    ? t(LOCALE_MONTHLY_REVIEW_UNKNOWN_LABEL)
    : (drinkLabels.value.find(label => label.id === labelId)?.name ?? t(LOCALE_MONTHLY_REVIEW_UNKNOWN_LABEL))

  return t(LOCALE_MONTHLY_REVIEW_TOP_LABEL, {
    label: labelName,
    share: top.sharePct.toFixed(1),
  })
})

const monthlyWeekdayTrendSummary = computed(() => {
  const weekday = monthlyData.value?.averages.byWeekday ?? []
  if (weekday.length === 0) return null

  const top = [...weekday].sort((a, b) => b.countAvg - a.countAvg)[0]
  if (!top) return null

  return t(LOCALE_MONTHLY_REVIEW_WEEKDAY_TREND, {
    weekday: t(LOCALE_CALENDAR_DAY_OF_WEEK_NUM[top.weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6]),
    avg: top.countAvg.toFixed(2),
  })
})

const monthlyMomSummary = computed(() => {
  const pct = monthlyData.value?.kpi.momChangePct
  if (pct === undefined || pct === null) return null
  if (pct > 0) return t(LOCALE_MONTHLY_REVIEW_MOM_UP, { pct: pct.toFixed(1) })
  if (pct < 0) return t(LOCALE_MONTHLY_REVIEW_MOM_DOWN, { pct: pct.toFixed(1) })
  return t(LOCALE_MONTHLY_REVIEW_MOM_FLAT)
})

const monthlyReviewLines = computed(() => {
  const lines = [
    monthlyTopLabelSummary.value,
    monthlyWeekdayTrendSummary.value,
    monthlyMomSummary.value,
  ].filter((line): line is string => Boolean(line))

  if (lines.length === 0) {
    return [t(LOCALE_MONTHLY_REVIEW_NO_DATA)]
  }
  return lines
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

      <article class="box monthly-review px-5 py-4">
        <header class="monthly-review-header mb-2">
          <span class="icon has-text-link monthly-review-icon p-1">
            <Icon name="mdi:chart-box-outline" />
          </span>
          <p class="title is-6 mb-0">
            {{ t(LOCALE_MONTHLY_REVIEW_TITLE) }}
          </p>
        </header>

        <ul class="monthly-review-list ml-1">
          <li
            v-for="(line, index) in monthlyReviewLines"
            :key="index"
            class="monthly-review-item py-2"
          >
            <span class="icon is-small has-text-info review-bullet">
              <Icon name="mdi:circle-medium" />
            </span>
            <span>{{ line }}</span>
          </li>
        </ul>
      </article>

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

<style scoped>
.monthly-review {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d6def5;
  background: linear-gradient(135deg, #f9fbff 0%, #f3f7ff 100%);
}

.monthly-review-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.monthly-review-icon {
  background: #e8f0ff;
  border-radius: 999px;
}

.monthly-review-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.monthly-review-item {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  color: #374151;
  line-height: 1.5;
}

.review-bullet {
  margin-top: 0.1rem;
  flex-shrink: 0;
}

</style>
