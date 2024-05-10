<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useIndexStore } from '@/store/pages/index'

const indexStore = useIndexStore()
const { date } = storeToRefs(indexStore)
const { prevDate, nextDate } = indexStore
</script>

<template>
  <div class="columns is-mobile my-4 mx-0">
    <MoleculesMinusButton :click-function="prevDate" />
    <input
      v-model="date"
      class="column input is-large mx-2"
      type="date"
    >
    <MoleculesPlusButton :click-function="nextDate" />
  </div>
</template>
