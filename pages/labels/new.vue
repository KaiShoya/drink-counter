<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const drinkLabelNewStore = usePageDrinkLabelNewStore()
const { name, color, standardAmount } = storeToRefs(drinkLabelNewStore)
const { initPage, create } = drinkLabelNewStore

initPage()
</script>

<template>
  <div>
    <OrganismsLabelsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:standard-amount="standardAmount"
      :save-function="create"
      save="drinks.add"
    />
  </div>
</template>
