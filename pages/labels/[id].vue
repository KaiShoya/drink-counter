<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const { name, color, standardAmount } = storeToRefs(drinkLabelEditStore)
const { initPage, update } = drinkLabelEditStore

initPage()
</script>

<template>
  <div>
    <OrganismsLabelsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:standard-amount="standardAmount"
      :save-function="update"
      save="drinks.update"
    />
  </div>
</template>
