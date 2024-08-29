<script setup lang="ts">
const indexStore = useIndexStore()
const { date } = storeToRefs(indexStore)
const { fetchDate, prevDate, nextDate } = indexStore
</script>

<template>
  <div class="columns is-mobile my-4 mx-0">
    <AtomsButtonsPickerMinusButton :click-function="prevDate" />
    <AtomsButtonsTodayButton :click-function="fetchDate" />
    <input
      v-model="date"
      aria-label="date picker"
      class="column input is-large radius-unset"
      type="date"
    >
    <AtomsButtonsPickerPlusButton :click-function="nextDate" />
  </div>
</template>
