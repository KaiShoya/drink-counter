<script
  setup
  lang="ts"
>
import { GChart } from 'vue-google-charts'
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'

const { computedChartData, computedPieChartOptions } = storeToRefs(useAggregationByDrinksStore())
</script>

<template>
  <GChart
    type="PieChart"
    :data="computedChartData"
    :options="computedPieChartOptions"
  />
</template>
