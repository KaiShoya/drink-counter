<script setup lang="ts">
const drinkLabelEditStore = usePageDrinkLabelEditStore()
const { name, color, standardAmount, isSaving } = storeToRefs(drinkLabelEditStore)
const { initPage, update } = drinkLabelEditStore

initPage()
</script>

<template>
  <div>
    <DomainLabelAtomsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:standard-amount="standardAmount"
      :save-function="update"
      :is-saving="isSaving"
      save="drinks.update"
    />
  </div>
</template>
