<script setup lang="ts">
import { useTotalStore } from '~/store/pages/data/total'

const { fetchDrinkCountersAll } = useTotalStore()

fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <PagesDataGraphsPieChart />

    <PagesDataAggregationByDrinksTable />

    <PagesDataAggregationByDowTable />
  </div>
</template>
