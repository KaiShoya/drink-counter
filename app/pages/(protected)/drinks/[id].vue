<script setup lang="ts">
const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId, isSaving } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById } = drinkEditStore

initPage()
</script>

<template>
  <div>
    <DomainDrinkAtomsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:amount="amount"
      v-model:drink-label-id="drinkLabelId"
      :save-function="updateDrinkById"
      :is-saving="isSaving"
      save="drinks.update"
    />
  </div>
</template>
