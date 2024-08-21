<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById } = drinkEditStore

initPage()
</script>

<template>
  <div>
    <OrganismsDrinksEdit
      v-model:name="name"
      v-model:color="color"
      v-model:amount="amount"
      v-model:drink-label-id="drinkLabelId"
      :save-function="updateDrinkById"
      save="drinks.update"
    />
  </div>
</template>
