<script setup lang="ts">
import { LOCALE_DATA_TOTAL } from '~/utils/locales'

const { t } = useI18n()
const { chartDataTitle, computedTableData, computedSumCount } = storeToRefs(useAggregationByDrinksStore())
</script>

<template>
  <DomainChartAtomsBaseTable
    :headers="chartDataTitle"
    :table-data="computedTableData"
    :footers="[
      t(LOCALE_DATA_TOTAL),
      computedSumCount,
    ]"
  />
</template>
