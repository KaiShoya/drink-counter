<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useIndexStore } from '@/store/pages/index'

const indexStore = useIndexStore()
const { date } = storeToRefs(indexStore)
const { fetchDate, prevDate, nextDate } = indexStore
</script>

<template>
  <div class="columns is-mobile my-4 mx-0">
    <MoleculesMinusButton :click-function="prevDate" />
    <button
      class="column is-50px button is-large ml-2"
      @click="fetchDate"
    >
      <span class="icon is-medium">
        <i class="mdi mdi-calendar-today" />
      </span>
    </button>
    <input
      v-model="date"
      class="column input is-large mx-2"
      type="date"
    >
    <MoleculesPlusButton :click-function="nextDate" />
  </div>
</template>

<style scoped>
.is-50px {
  flex: none;
  width: 50px;
}
</style>
