<script setup lang="ts">
import { useAnnualStore } from '~/store/pages/data/annual'

const annualStore = useAnnualStore()
const { year } = storeToRefs(annualStore)
const { prevYear, nextYear } = annualStore
</script>

<template>
  <div class="columns is-mobile my-2 mx-0">
    <AtomsButtonsPickerMinusButton :click-function="prevYear" />
    <input
      v-model="year"
      aria-label="year picker"
      class="column input is-large radius-unset"
      type="number"
    >
    <AtomsButtonsPickerPlusButton :click-function="nextYear" />
  </div>
</template>
