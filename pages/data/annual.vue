<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useAnnualStore } from '~/store/pages/data/annual'

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
