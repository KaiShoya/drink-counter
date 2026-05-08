<script setup lang="ts">
import { LOCALE_DRINKS_EDIT_TITLE } from '~/utils/locales'

const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId, isSaving } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById } = drinkEditStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: computed(() => t(LOCALE_DRINKS_EDIT_TITLE, { name: name.value ?? '' })),
})
</script>

<template>
  <div>
    <h2 class="title is-5">
      {{ t(LOCALE_DRINKS_EDIT_TITLE, { name }) }}
    </h2>
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
