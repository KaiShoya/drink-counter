<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useMonthlyStore } from '~/store/pages/data/monthly'

const monthlyStore = useMonthlyStore()
const { yearMonth, chartDataTitle, computeCalendarData, computeGraphData, computedTableData, computedChartData, computedChartOptions, computedPieChartOptions } = storeToRefs(monthlyStore)
const { prevMonth, nextMonth, fetchDrinkCounters } = monthlyStore

// カレンダー再描画用
const updateCalendar = ref<number>(0)

await fetchDrinkCounters()

watch(yearMonth, async () => {
  await fetchDrinkCounters()
  // keyを更新してカレンダーを再描画
  updateCalendar.value++
})
</script>

<template>
  <div class="container">
    <div class="columns is-mobile my-2 mx-0">
      <button
        class="column is-2 button is-large"
        @click="prevMonth"
      >
        &lt;
      </button>
      <input
        v-model="yearMonth"
        class="column input is-large"
        type="month"
      >
      <button
        class="column is-2 button is-large"
        @click="nextMonth"
      >
        &gt;
      </button>
    </div>

    <PagesDataGraphsFCalendar
      :key="updateCalendar"
      :year-month="yearMonth"
      :data="computeCalendarData"
    />
    <PagesDataGraphsComboChart
      :data="computeGraphData"
      :options="computedChartOptions"
    />
    <PagesDataGraphsPieChart
      :data="computedChartData"
      :options="computedPieChartOptions"
    />
    <PagesDataTable
      :headers="chartDataTitle"
      :table-data="computedTableData"
    />
    <PagesDataAggregationByDowTable />
  </div>
</template>
