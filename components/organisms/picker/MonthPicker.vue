<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMonthlyStore } from '~/store/pages/data/monthly'

const monthlyStore = useMonthlyStore()
const { yearMonth } = storeToRefs(monthlyStore)
const { prevMonth, nextMonth } = monthlyStore
</script>

<template>
  <div class="columns is-mobile my-2 mx-0">
    <MoleculesMinusButton :click-function="prevMonth" />
    <input
      v-model="yearMonth"
      class="column input is-large radius-unset"
      type="month"
    >
    <MoleculesPlusButton :click-function="nextMonth" />
  </div>
</template>
