<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTotalStore } from '~/store/pages/data/total'

const totalStore = useTotalStore()
const { chartDataTitle, calendarTitle, computeCalendarData, computedTableData, computedChartData } = storeToRefs(totalStore)
const { fetchDrinkCountersAll } = totalStore

await fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <PagesDataGraphsCalendar
      :title="calendarTitle"
      :data="computeCalendarData"
    />
    <PagesDataGraphsPieChart :data="computedChartData" />
    <PagesDataTable
      :titles="chartDataTitle"
      :table-data="computedTableData"
    />
  </div>
</template>
