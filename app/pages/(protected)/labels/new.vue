<script setup lang="ts">
import { LOCALE_LABELS_NEW_TITLE } from '~/utils/locales'

const drinkLabelNewStore = usePageDrinkLabelNewStore()
const { name, color, standardAmount, isSaving } = storeToRefs(drinkLabelNewStore)
const { initPage, create } = drinkLabelNewStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_LABELS_NEW_TITLE),
})
</script>

<template>
  <div>
    <h2 class="title is-5">
      {{ t(LOCALE_LABELS_NEW_TITLE) }}
    </h2>
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
