<script setup lang="ts">
import { GChart } from 'vue-google-charts'
defineProps<{
  data: Array<Array<String | Number>>,
  options?: any,
}>()
</script>

<template>
  <GChart
    type="PieChart"
    :data="data"
    :options="options"
  />
</template>
