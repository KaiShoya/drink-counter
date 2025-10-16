<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_MONTHLY),
})

// 既存ページは旧monthlyStoreを使用しているが、新しい月次集計も併用して試せるように追加
const monthlyStore = useMonthlyStore()
const { yearMonth, computeCalendarData, computeGraphData, computedChartOptions } = storeToRefs(monthlyStore)
const { fetchDrinkCounters } = monthlyStore

// 新しい月次集計ストア
import { useMonthlySummaryStore } from '../../../store/pages/index/monthlySummary'
const monthlySummary = useMonthlySummaryStore()
const { data: monthlyData } = storeToRefs(monthlySummary)

// カレンダー再描画用
const updateCalendar = ref<number>(0)

fetchDrinkCounters()

// 新しい集計も初回取得
monthlySummary.fetchMonthlySummary({ month: yearMonth.value, timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })

watch(yearMonth, async () => {
  await fetchDrinkCounters()
  await monthlySummary.fetchMonthlySummary({ month: yearMonth.value, timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })
  // keyを更新してカレンダーを再描画
  updateCalendar.value++
})

// 型安全のため、count を number に正規化
const calendarDataNormalized = computed(() => computeCalendarData.value.map(d => ({ date: d.date, count: d.count ?? 0 })))
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesMonthPicker />

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

    <DomainChartMoleculesAggregationByDowTable />

    <DomainChartMoleculesAggregationByDowTable />
  </div>
</template>
