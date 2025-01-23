<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_MONTHLY),
})

const monthlyStore = useMonthlyStore()
const { yearMonth, computeCalendarData, computeGraphData, computedChartOptions } = storeToRefs(monthlyStore)
const { fetchDrinkCounters } = monthlyStore

// カレンダー再描画用
const updateCalendar = ref<number>(0)

fetchDrinkCounters()

watch(yearMonth, async () => {
  await fetchDrinkCounters()
  // keyを更新してカレンダーを再描画
  updateCalendar.value++
})
</script>

<template>
  <div class="container">
    <DomainPickerMoleculesMonthPicker />

    <DomainChartAtomsFCalendar
      :key="updateCalendar"
      :year-month="yearMonth"
      :data="computeCalendarData"
    />
    <DomainChartAtomsComboChart
      :data="computeGraphData"
      :options="computedChartOptions"
    />

    <DomainChartAtomsPieChart />

    <DomainChartMoleculesAggregationByDowTable />

    <DomainChartMoleculesAggregationByDowTable />
  </div>
</template>
