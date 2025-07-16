<script setup lang="ts">
const { computedAggregationByDowToArray } = storeToRefs(useAggregationByDowStore())
</script>

<template>
  <DomainChartAtomsBaseTable
    :headers="[
      $t(LOCALE_AGGREGATION_DOW),
      $t(LOCALE_AGGREGATION_SUM_COUNT),
      $t(LOCALE_AGGREGATION_AVG_COUNT),
      $t(LOCALE_AGGREGATION_MAX_TYPE_OF_DRINKS),
      $t(LOCALE_AGGREGATION_AVG_TYPE_OF_DRINKS),
      $t(LOCALE_AGGREGATION_RECORD_COUNT),
    ]"
    :table-data="computedAggregationByDowToArray"
  />
</template>
