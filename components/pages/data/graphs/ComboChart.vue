<script
  setup
  lang="ts"
>
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
</script>

<template>
  <template v-if="data.length > 1">
    <GChart
      type="ComboChart"
      :data="data"
      :options="options"
    />
  </template>
</template>
