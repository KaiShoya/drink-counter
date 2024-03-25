<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useAnnualStore } from '~/store/pages/data/annual'

const annualStore = useAnnualStore()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { year, calendarTitle, computeCalendarData } = storeToRefs(annualStore)
const { prevYear, nextYear, fetchDrinkCounters } = annualStore

await fetchDrinkCounters()

watch(year, async () => {
  await fetchDrinkCounters()
})
</script>

<template>
  <div class="container">
    <div class="columns is-mobile my-2 mx-0">
      <button
        class="column is-2 button is-large"
        @click="prevYear"
      >
        &lt;
      </button>

      <input
        v-model="year"
        class="column input is-large"
        type="number"
      >

      <button
        class="column is-2 button is-large"
        @click="nextYear"
      >
        &gt;
      </button>
    </div>

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
