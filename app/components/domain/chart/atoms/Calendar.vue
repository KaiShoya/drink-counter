<script setup lang="ts">
import { GChart } from 'vue-google-charts'

const props = defineProps<{
  title: Array<{ type: string, id: string }>
  data: Array<Array<Date | number>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any
}>()

const viewportWidth = ref<number>(1280)

const calendarCellSize = computed(() => {
  if (viewportWidth.value < 480) return 12
  if (viewportWidth.value < 768) return 14
  return 16
})

const computedOptions = computed(() => {
  return {
    height: viewportWidth.value < 768 ? 220 : 280,
    calendar: {
      cellSize: calendarCellSize.value,
    },
    ...(props.options ?? {}),
  }
})

const updateViewportWidth = () => {
  viewportWidth.value = window.innerWidth
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportWidth)
})

onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
})
</script>

<template>
  <div class="calendar-wrapper">
    <GChart
      class="calendar"
      type="Calendar"
      :data="[props.title, ...props.data]"
      :options="computedOptions"
      :settings="{ packages: ['calendar'] }"
    />
  </div>
</template>

<style scoped>
.calendar-wrapper {
  overflow: hidden;
  width: 100%;
}

.calendar {
  width: 100%;
  max-width: 100%;
}
</style>
