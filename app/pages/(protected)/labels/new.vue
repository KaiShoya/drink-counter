<script setup lang="ts">
const drinkLabelNewStore = usePageDrinkLabelNewStore()
const { name, color, standardAmount, isSaving } = storeToRefs(drinkLabelNewStore)
const { initPage, create } = drinkLabelNewStore

initPage()
</script>

<template>
  <div>
    <DomainLabelAtomsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:standard-amount="standardAmount"
      :save-function="create"
      :is-saving="isSaving"
      save="drinks.add"
    />
  </div>
</template>
