<script setup lang="ts">
import { LOCALE_DRINKS_NEW_TITLE } from '~/utils/locales'

const drinkNewStore = usePageDrinkNewStore()
const { name, color, amount, drinkLabelId, isSaving } = storeToRefs(drinkNewStore)
const { initPage, create } = drinkNewStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_DRINKS_NEW_TITLE),
})
</script>

<template>
  <div>
    <h2 class="title is-5">
      {{ t(LOCALE_DRINKS_NEW_TITLE) }}
    </h2>
    <DomainDrinkAtomsEdit
      v-model:name="name"
      v-model:color="color"
      v-model:amount="amount"
      v-model:drink-label-id="drinkLabelId"
      :save-function="create"
      :is-saving="isSaving"
      save="drinks.add"
    />
  </div>
</template>
