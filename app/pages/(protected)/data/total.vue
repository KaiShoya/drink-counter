<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_TOTAL),
})

const { fetchDrinkCountersAll } = useTotalStore()

fetchDrinkCountersAll()
</script>

<template>
  <div class="container">
    <DomainChartAtomsPieChart />

    <DomainChartMoleculesAggregationByDrinksTable />

    <DomainChartMoleculesAggregationByDowTable />
  </div>
</template>
