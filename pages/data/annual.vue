<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_ANNUAL),
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
    <OrganismsPickerYearPicker />

    <!-- メモリリークするため一旦コメントアウト -->
    <!-- <PagesDataGraphsCalendar
      :title="calendarTitle"
      :data="computeCalendarData"
    /> -->

    <PagesDataGraphsPieChart />

    <PagesDataAggregationByDrinksTable />

    <PagesDataAggregationByDowTable />
  </div>
</template>
