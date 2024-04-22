<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkNewStore } from '~/store/pages/drinks/new'

const drinkNewStore = usePageDrinkNewStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkNewStore)
const { initPage, create } = drinkNewStore

initPage()
</script>

<template>
  <div>
    <OrganismsDrinksEdit
      :name
      :color
      :amount
      :drink-label-id
      :save-function="create"
      save="drinks.add"
    />
  </div>
</template>
