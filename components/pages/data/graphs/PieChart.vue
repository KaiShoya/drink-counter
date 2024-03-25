<script
  setup
  lang="ts"
>
import { GChart } from 'vue-google-charts'
import { useAggregationByDrinksTablesStore } from '~/store/pages/data/components/aggregationByDrinksTables'

const { computedChartData, computedPieChartOptions } = storeToRefs(useAggregationByDrinksTablesStore())
</script>

<template>
  <GChart
    type="PieChart"
    :data="computedChartData"
    :options="computedPieChartOptions"
  />
</template>
