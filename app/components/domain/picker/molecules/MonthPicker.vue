<script setup lang="ts">
const monthlyStore = useMonthlyStore()
const { yearMonth } = storeToRefs(monthlyStore)
const { prevMonth, nextMonth } = monthlyStore
</script>

<template>
  <div class="is-mobile my-2 mx-0 is-vcentered">
    <DomainPickerAtomsMinusButton :click-function="prevMonth" />
    <input
      v-model="yearMonth"
      aria-label="year month picker"
      class="input is-large radius-unset is-fullwidth"
      type="month"
    >
    <DomainPickerAtomsPlusButton :click-function="nextMonth" />
  </div>
</template>
