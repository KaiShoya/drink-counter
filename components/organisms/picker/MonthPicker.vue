<script setup lang="ts">
const monthlyStore = useMonthlyStore()
const { yearMonth } = storeToRefs(monthlyStore)
const { prevMonth, nextMonth } = monthlyStore
</script>

<template>
  <div class="columns is-mobile my-2 mx-0">
    <AtomsButtonsPickerMinusButton :click-function="prevMonth" />
    <input
      v-model="yearMonth"
      aria-label="year month picker"
      class="column input is-large radius-unset"
      type="month"
    >
    <AtomsButtonsPickerPlusButton :click-function="nextMonth" />
  </div>
</template>
