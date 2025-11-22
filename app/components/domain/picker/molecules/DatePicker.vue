<script setup lang="ts">
const indexStore = useIndexStore()
const { date } = storeToRefs(indexStore)
const { setToday, prevDate, nextDate } = indexStore
</script>

<template>
  <div class="is-mobile my-4 mx-0 is-vcentered">
    <DomainPickerAtomsMinusButton :click-function="prevDate" />
    <DomainPickerAtomsTodayButton :click-function="setToday" />
    <input
      v-model="date"
      aria-label="date picker"
      class="input is-large radius-unset is-fullwidth"
      type="date"
    >
    <DomainPickerAtomsPlusButton :click-function="nextDate" />
  </div>
</template>
