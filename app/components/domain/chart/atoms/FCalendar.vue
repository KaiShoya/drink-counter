<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import type { CalendarOptions } from '@fullcalendar/core'

const props = defineProps<{
  data: Array<{
    date: string
    count: number
    overGoal: boolean
  }>
  yearMonth: string
}>()

const calcEvents = () => {
  const maxCount = Math.max(...props.data.map(v => v.count))
  const events = props.data.map((v) => {
    return {
      start: v.date,
      display: 'background',
      color: `#044A05${Math.floor(255 * (v.count / maxCount)).toString(16)}`,
      classNames: v.overGoal ? ['fc-event-over-goal'] : [],
    }
  })

  return events.length > 0 ? events : undefined
}

const calendarOptions: CalendarOptions = {
  initialDate: new Date(props.yearMonth),
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  height: 500,
  headerToolbar: false,
  events: calcEvents(),
}
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style>
/* FullCalendar event custom styles */
.fc-event-over-goal {
  border: 4px solid #f14668 !important; /* Bulma danger color */
  box-sizing: border-box;
}
</style>
