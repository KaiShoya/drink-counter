<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useTotalStore } from '~/store/pages/data/total'

const totalStore = useTotalStore()
const { chartDataTitle, computedTableData, computedChartData, computedPieChartOptions } = storeToRefs(totalStore)
const { fetchDrinkCountersAll } = totalStore

await fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <PagesDataGraphsPieChart
      :data="computedChartData"
      :options="computedPieChartOptions"
    />

    <PagesDataTable
      :headers="chartDataTitle"
      :table-data="computedTableData"
    />

    <PagesDataAggregationTable />
  </div>
</template>
