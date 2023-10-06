<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMonthlyStore } from '~/store/pages/data/monthly'

const monthlyStore = useMonthlyStore()
const { yearMonth, chartDataTitle, computeCalendarData, computeGraphData, computedTableData, computedChartData } = storeToRefs(monthlyStore)
const { fetchDrinkCounters } = monthlyStore

// カレンダー再描画用
const updateCalendar = ref(0)

await fetchDrinkCounters()

// 年月のinput属性（next, prevボタンで使用）
// WARNING: HTMLInputElementのメソッド呼出以外で利用禁止!
const inputMonth = useState<HTMLInputElement | null>(() => null)

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
        @click="inputMonth?.stepDown()"
      >
        &lt;
      </button>
      <input
        ref="inputMonth"
        v-model="yearMonth"
        class="column input is-large"
        type="month"
      >
      <button
        class="column is-2 button is-large"
        @click="inputMonth?.stepUp()"
      >
        &gt;
      </button>
    </div>

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
