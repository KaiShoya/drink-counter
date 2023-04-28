<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { CalendarOptions } from '@fullcalendar/core'

const props = defineProps<{
  data: Array<{
    date: string,
    count: number
  }>,
  yearMonth: string
}>()

const calcEvents = () => {
  const maxCount = Math.max(...props.data.map(v => v.count))
  const events = props.data.map((v) => {
    return {
      start: v.date,
      display: 'background',
      color: `#044A05${Math.floor(255 * (v.count / maxCount)).toString(16)}`
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
  events: calcEvents()
}
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>
