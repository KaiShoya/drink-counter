<script setup lang="ts">
import { GChart } from 'vue-google-charts'
withDefaults(defineProps<{
  data: Array<Array<String | Number>>,
  options?: any,
}>(), {
  options: {
    seriesType: 'bars',
    series: { 0: { type: 'line' } },
  },
})
</script>

<template>
  <GChart
    type="ComboChart"
    :data="data"
    :options="options"
  />
</template>
