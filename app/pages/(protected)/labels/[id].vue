<script setup lang="ts">
import { LOCALE_LABELS_EDIT_TITLE } from '~/utils/locales'

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const { name, color, standardAmount, isSaving } = storeToRefs(drinkLabelEditStore)
const { initPage, update } = drinkLabelEditStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: computed(() => t(LOCALE_LABELS_EDIT_TITLE, { name: name.value ?? '' })),
})
</script>

<template>
  <div>
    <h2 class="title is-5">
      {{ t(LOCALE_LABELS_EDIT_TITLE, { name }) }}
    </h2>
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
