<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { GChart } from 'vue-google-charts'
defineProps<{
  data: Array<Array<{ type: string; id: string; }> | Array<Date | Number>>,
  options?: any,
}>()
</script>

<template>
  <GChart
    type="Calendar"
    :data="data"
    :options="options"
    :settings="{ packages: ['calendar'], }"
  />
</template>
