<script
  setup
  lang="ts"
>
import { useAggregationByDrinksStore } from '~/store/pages/data/components/aggregationByDrinks'
const { $i18n } = useNuxtApp()
const { chartDataTitle, computedTableData } = storeToRefs(useAggregationByDrinksStore())

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
