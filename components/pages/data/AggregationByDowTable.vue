<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useAggregationByDowStore } from '~/store/pages/data/components/aggregationByDow'

const { computedAggregationByDowToArray } = storeToRefs(useAggregationByDowStore())
</script>

<template>
  <MoleculesBaseTable
    :headers="[
      $t('aggregation.dow'),
      $t('aggregation.sum_count'),
      $t('aggregation.avg_count'),
      $t('aggregation.max_type_of_drinks'),
      $t('aggregation.avg_type_of_drinks'),
      $t('aggregation.record_count'),
    ]"
    :table-data="computedAggregationByDowToArray"
  />
</template>
