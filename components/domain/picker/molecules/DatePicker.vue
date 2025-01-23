<script setup lang="ts">
const indexStore = useIndexStore()
const { date } = storeToRefs(indexStore)
const { fetchDate, prevDate, nextDate } = indexStore
</script>

<template>
  <div class="columns is-mobile my-4 mx-0">
    <DomainPickerAtomsMinusButton :click-function="prevDate" />
    <DomainPickerAtomsTodayButton :click-function="fetchDate" />
    <input
      v-model="date"
      aria-label="date picker"
      class="column input is-large radius-unset"
      type="date"
    >
    <DomainPickerAtomsPlusButton :click-function="nextDate" />
  </div>
</template>
