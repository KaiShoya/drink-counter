<script setup lang="ts">
const annualStore = useAnnualStore()
const { year } = storeToRefs(annualStore)
const { prevYear, nextYear } = annualStore
</script>

<template>
  <div class="columns is-mobile my-2 mx-0">
    <DomainPickerAtomsMinusButton :click-function="prevYear" />
    <input
      v-model="year"
      aria-label="year picker"
      class="column input is-large radius-unset"
      type="number"
    >
    <DomainPickerAtomsPlusButton :click-function="nextYear" />
  </div>
</template>
