<script setup lang="ts">
const annualStore = useAnnualStore()
const { year } = storeToRefs(annualStore)
const { prevYear, nextYear } = annualStore
</script>

<template>
  <div class="is-mobile my-2 mx-0 is-vcentered">
    <DomainPickerAtomsMinusButton :click-function="prevYear" />
    <input
      v-model="year"
      aria-label="year picker"
      class="input is-large radius-unset is-fullwidth"
      type="number"
    >
    <DomainPickerAtomsPlusButton :click-function="nextYear" />
  </div>
</template>
