<script
  setup
  lang="ts"
>
import { useTotalStore } from '~/store/pages/data/total'

const { fetchDrinkCountersAll } = useTotalStore()

await fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <PagesDataGraphsPieChart />

    <PagesDataAggregationByDrinksTable />

    <PagesDataAggregationByDowTable />
  </div>
</template>
