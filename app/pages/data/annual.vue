<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_ANNUAL),
})

const annualStore = useAnnualStore()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { year, calendarTitle, computeCalendarData } = storeToRefs(annualStore)
const { fetchDrinkCounters } = annualStore

fetchDrinkCounters()

// 年次KPIの新ストア
const annualSummary = useAnnualSummaryStore()
// 初回取得
annualSummary.fetchAnnualSummary({ year: year.value, timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })

watch(year, async () => {
  await fetchDrinkCounters()
  await annualSummary.fetchAnnualSummary({ year: year.value, timezone: 'Asia/Tokyo', dayCutoffHour: 5, filters: { visibility: 'visible' } })
})
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesYearPicker />

    <DomainAnnualKpiCards />

    <!-- メモリリークするため一旦コメントアウト -->
    <!-- <MoleculesGraphsCalendar
      :title="calendarTitle"
      :data="computeCalendarData"
    /> -->

    <DomainChartAtomsPieChart />

    <DomainChartMoleculesAggregationByDrinksTable />

    <DomainChartMoleculesAggregationByDowTable />
  </div>
</template>
