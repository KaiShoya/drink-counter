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

const annualSummaryConditions = computed(() => ({
  timezone: userSetting.value.timezone,
  dayCutoffHour: userSetting.value.switching_timing,
  filters: { visibility: 'visible' as const },
}))

fetchDrinkCounters()

// 年次KPIの新ストア
const annualSummary = useAnnualSummaryStore()
const fetchAnnualSummary = async () => {
  await annualSummary.fetchAnnualSummary({
    year: year.value,
    ...annualSummaryConditions.value,
  })
}

// 初回取得
fetchAnnualSummary()

watch([
  year,
  () => userSetting.value.timezone,
  () => userSetting.value.switching_timing,
], async () => {
  await fetchDrinkCounters()
  await fetchAnnualSummary()
})
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesYearPicker />

    <div class="notification is-light py-3 px-4">
      <p>{{ t(LOCALE_SETTINGS_TIMEZONE) }}: {{ userSetting.timezone }}</p>
      <p>{{ t(LOCALE_SETTINGS_SWITCHING_TIMING) }}: {{ userSetting.switching_timing }} {{ t(LOCALE_SETTINGS_OCLOCK) }}</p>
    </div>

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
