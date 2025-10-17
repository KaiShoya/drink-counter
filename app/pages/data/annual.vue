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

watch(year, async () => {
  await fetchDrinkCounters()
})
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesYearPicker />

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
