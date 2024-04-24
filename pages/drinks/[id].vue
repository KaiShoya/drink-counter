<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkEditStore } from '~/store/pages/drinks/edit'

const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById } = drinkEditStore

initPage()
</script>

<template>
  <div>
    <OrganismsDrinksEdit
      :name
      :color
      :amount
      :drink-label-id
      :save-function="updateDrinkById"
      save="drinks.update"
    />
  </div>
</template>
