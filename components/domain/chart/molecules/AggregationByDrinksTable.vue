<script setup lang="ts">
const { chartDataTitle, computedTableData, computedSumCount } = storeToRefs(useAggregationByDrinksStore())
</script>

<template>
  <DomainChartAtomsBaseTable
    :headers="chartDataTitle"
    :table-data="computedTableData"
    :footers="[
      $t(LOCALE_DATA_TOTAL),
      computedSumCount,
    ]"
  />
</template>
