<script setup lang="ts">
import { usePageDrinkNewStore } from '~/store/pages/drinks/new'

const drinkNewStore = usePageDrinkNewStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkNewStore)
const { initPage, create } = drinkNewStore

initPage()
</script>

<template>
  <div>
    <OrganismsDrinksEdit
      v-model:name="name"
      v-model:color="color"
      v-model:amount="amount"
      v-model:drink-label-id="drinkLabelId"
      :save-function="create"
      save="drinks.add"
    />
  </div>
</template>
