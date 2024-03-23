<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useAggregationByDowTablesStore } from '~/store/pages/data/components/aggregationByDowTables'

const { computedAggregationByDowToArray } = storeToRefs(useAggregationByDowTablesStore())
</script>

<template>
  <MoleculesBaseTable
    :headers="[
      $t('aggregation.dow'),
      $t('aggregation.sum_count'),
      $t('aggregation.avg_count'),
      $t('aggregation.max_type_of_drinks'),
      $t('aggregation.avg_type_of_drinks')
    ]"
    :table-data="computedAggregationByDowToArray"
  />
</template>
