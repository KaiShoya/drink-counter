<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { GChart } from 'vue-google-charts'
defineProps<{
  data: Array<Array<{ type: string; id: string; }> | Array<Date | Number>>,
  options?: any,
}>()
</script>

<template>
  <div class="scroll">
    <GChart
      class="calendar"
      type="Calendar"
      :data="data"
      :options="options"
      :settings="{ packages: ['calendar'], }"
    />
  </div>
</template>

<style scoped>
.scroll {
  overflow-x: scroll;
  overflow-y: hidden;
}

.calendar {
  width: 915px;
}
</style>
