<script setup lang="ts">
import { useTotalStore } from '~/store/pages/data/total'

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_TOTAL),
})

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
