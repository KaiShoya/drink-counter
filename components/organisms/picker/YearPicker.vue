<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAnnualStore } from '~/store/pages/data/annual'

const annualStore = useAnnualStore()
const { year } = storeToRefs(annualStore)
const { prevYear, nextYear } = annualStore
</script>

<template>
  <div class="columns is-mobile my-2 mx-0">
    <MoleculesMinusButton :click-function="prevYear" />
    <input
      v-model="year"
      class="column input is-large"
      type="number"
    >
    <MoleculesPlusButton :click-function="nextYear" />
  </div>
</template>
