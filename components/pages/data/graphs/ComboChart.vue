<script setup lang="ts">
import { GChart } from 'vue-google-charts'
withDefaults(defineProps<{
  data: Array<Array<String | Number>>,
  options?: any,
}>(), {
  options: {
    seriesType: 'bars',
    legend: { position: 'bottom' },
    series: { 0: { type: 'line' } },
  },
})
const { isLoading } = storeToRefs(useAppStore())
</script>

<template>
  <GChart
    v-if="data.length > 1 && !isLoading"
    type="ComboChart"
    :data="data"
    :options="options"
  />
</template>
