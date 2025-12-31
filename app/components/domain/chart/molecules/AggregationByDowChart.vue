<script setup lang="ts">
import { GChart } from 'vue-google-charts'
import { LOCALE_CALENDAR_DAY_OF_WEEK_NUM, LOCALE_AGGREGATION_DOW } from '~/utils/locales'

const { t } = useI18n()
const monthlySummary = useMonthlySummaryStore()
const { data, loading } = storeToRefs(monthlySummary)

/**
 * 曜日別集計グラフ (Bar Chart)
 * data.averages.byWeekday を使用
 */

const chartData = computed(() => {
  // Header
  const header = [t('calendar.day_of_week'), t('aggregation.avg_count')]
  
  if (!data.value?.averages?.byWeekday) return [header, ['', 0]]

  // Rows: [DowName, Count]
  // byWeekday is 0(Sun)..6(Sat)
  const rows = data.value.averages.byWeekday.map(d => {
    // 曜日名の取得
    const dowKey = LOCALE_CALENDAR_DAY_OF_WEEK_NUM[d.weekday as keyof typeof LOCALE_CALENDAR_DAY_OF_WEEK_NUM]
    return [t(dowKey), d.countAvg]
  })

  return [header, ...rows]
})

const chartOptions = computed(() => {
  return {
    title: t(LOCALE_AGGREGATION_DOW), // 使用するLocaleキーがない場合は適宜調整
    width: '100%',
    height: 300,
    legend: { position: 'none' },
    colors: ['#48c774'], // Bulma success color-ish
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    chartArea: { width: '80%', height: '80%' },
    vAxis: { minValue: 0, format: '0.#' },
  } as any
})

</script>

<template>
  <div class="box">
    <div v-if="loading || !data" class="has-text-centered p-4">
      Loading...
    </div>
    <div v-else>
      <GChart
        type="ColumnChart"
        :data="chartData"
        :options="chartOptions"
      />
    </div>
  </div>
</template>
