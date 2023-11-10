<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { GChart } from 'vue-google-charts'
defineProps<{
  title: Array<{ type: string; id: string; }>,
  data: Array<Array<Date | Number>>,
  options?: any,
}>()
// FIXME: 年を跨いだ時に2年目以降が表示されない（見切れる）
</script>

<template>
  <div class="scroll-x">
    <GChart
      class="calendar"
      type="Calendar"
      :data="[title, ...data]"
      :options="options"
      :settings="{ packages: ['calendar'], }"
    />
  </div>
</template>

<style scoped>
.scroll-x {
  overflow-x: scroll;
}

.calendar {
  width: 915px;
}
</style>
