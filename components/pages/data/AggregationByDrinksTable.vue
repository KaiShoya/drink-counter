<script
  setup
  lang="ts"
>
import { useAggregationByDrinksTablesStore } from '~/store/pages/data/components/aggregationByDrinksTables'
const { $i18n } = useNuxtApp()
const { chartDataTitle, computedTableData } = storeToRefs(useAggregationByDrinksTablesStore())

const footers = [
  $i18n.t('data.total'),
  computedTableData.value.reduce((accumulator, currentValue) => accumulator + Number(currentValue[1]), 0),
]
</script>

<template>
  <MoleculesBaseTable
    :headers="chartDataTitle"
    :table-data="computedTableData"
    :footers="footers"
  />
</template>
