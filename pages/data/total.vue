<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTotalStore } from '~/store/pages/data/total'

const totalStore = useTotalStore
const { chartDataTitle, computeCalendarData, computedTableData, computedChartData } = storeToRefs(totalStore())
const { fetchDrinkCountersAll } = totalStore()

await fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <DataGraphsCalendar :data="computeCalendarData" />
    <DataGraphsPieChart :data="computedChartData" />
    <DataTable
      :titles="chartDataTitle"
      :table-data="computedTableData"
    />
  </div>
</template>
