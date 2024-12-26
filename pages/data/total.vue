<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_TOTAL),
})

const { fetchDrinkCountersAll } = useTotalStore()

fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <MoleculesGraphsPieChart />

    <OrganismsDataAggregationByDrinksTable />

    <OrganismsDataAggregationByDowTable />
  </div>
</template>
