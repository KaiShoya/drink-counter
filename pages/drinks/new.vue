<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const drinkNewStore = usePageDrinkNewStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkNewStore)
const { initPage, create } = drinkNewStore

initPage()
</script>

<template>
  <div>
    <DomainDrinkAtomsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:amount="amount"
      v-model:drink-label-id="drinkLabelId"
      :save-function="create"
      save="drinks.add"
    />
  </div>
</template>
