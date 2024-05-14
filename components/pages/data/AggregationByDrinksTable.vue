<script setup lang="ts">
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'
const { chartDataTitle, computedTableData, computedSumCount } = storeToRefs(useAggregationByDrinksStore())
</script>

<template>
  <MoleculesBaseTable
    :headers="chartDataTitle"
    :table-data="computedTableData"
    :footers="[
      $t(LOCALE_DATA_TOTAL),
      computedSumCount,
    ]"
  />
</template>
