<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkLabelEditStore } from '~/store/pages/labels/edit'

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const { name, color, standardAmount } = storeToRefs(drinkLabelEditStore)
const { initPage, update } = drinkLabelEditStore

initPage()
</script>

<template>
  <div>
    <OrganismsLabelsEdit
      :name
      :color
      :standard-amount
      :save-function="update"
      save="drinks.update"
    />
  </div>
</template>
