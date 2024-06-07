<script setup lang="ts">
import { useIndexStore } from '@/store/pages/index'

const indexStore = useIndexStore()
const { date } = storeToRefs(indexStore)
const { fetchDate, prevDate, nextDate } = indexStore
</script>

<template>
  <div class="columns is-mobile my-4 mx-0">
    <MoleculesMinusButton :click-function="prevDate" />
    <MoleculesTodayButton :click-function="fetchDate" />
    <input
      v-model="date"
      aria-label="date picker"
      class="column input is-large radius-unset"
      type="date"
    >
    <MoleculesPlusButton :click-function="nextDate" />
  </div>
</template>
