<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById, getDrinkLabels } = drinkEditStore

initPage()
</script>

<template>
  <div>
    <DomainDrinkAtomsEdit
      v-model:drink-labels="getDrinkLabels"
      v-model:name="name"
      v-model:color="color"
      v-model:amount="amount"
      v-model:drink-label-id="drinkLabelId"
      :save-function="updateDrinkById"
      save="drinks.update"
    />
  </div>
</template>
