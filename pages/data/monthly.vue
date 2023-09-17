<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMonthlyStore } from '~/store/pages/data/monthly'

const monthlyStore = useMonthlyStore
const { yearMonth, chartDataTitle, computeCalendarData, computeGraphData, computedTableData, computedChartData } = storeToRefs(monthlyStore())
const { fetchDrinkCounters } = monthlyStore()

// カレンダー再描画用
const updateCalendar = ref(0)

await fetchDrinkCounters()

watch(yearMonth, async () => {
  await fetchDrinkCounters()
  // keyを更新してカレンダーを再描画
  updateCalendar.value++
})
</script>

<template>
  <div class="container">
    <input
      v-model="yearMonth"
      class="input"
      type="month"
    >
    <DataGraphsFCalendar
      :key="updateCalendar"
      :year-month="yearMonth"
      :data="computeCalendarData"
    />
    <DataGraphsComboChart :data="computeGraphData" />
    <DataGraphsPieChart :data="computedChartData" />
    <DataTable
      :titles="chartDataTitle"
      :table-data="computedTableData"
    />
  </div>
</template>
