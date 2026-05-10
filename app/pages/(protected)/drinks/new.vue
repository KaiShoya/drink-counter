<script setup lang="ts">
import {
  LOCALE_LABELS_NEW_TITLE,
  LOCALE_DRINKS_UNSAVED_FORM_CONFIRM,
  LOCALE_MODAL_UNSAVED_TITLE,
} from '~/utils/locales'

const drinkLabelNewStore = usePageDrinkLabelNewStore()
const { name, color, standardAmount, isSaving } = storeToRefs(drinkLabelNewStore)
const { initPage, create } = drinkLabelNewStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_LABELS_NEW_TITLE),
})

type Snapshot = { name: string; color: string | null; standardAmount: number }
const initial = ref<Snapshot | null>(null)

onMounted(() => {
  initial.value = { name: name.value, color: color.value, standardAmount: standardAmount.value }
})

const isDirty = computed(() =>
  initial.value !== null && (
    name.value !== initial.value.name ||
    color.value !== initial.value.color ||
    standardAmount.value !== initial.value.standardAmount
  ),
)

const { showUnsavedModal, discardAndLeave, cancelLeave } = useUnsavedChangesGuard({
  isDirty,
  canSkip: () => isSaving.value,
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

    <CommonModalMoleculesUnsavedChanges
      :title="t(LOCALE_MODAL_UNSAVED_TITLE)"
      :content="t(LOCALE_DRINKS_UNSAVED_FORM_CONFIRM)"
      :discard="discardAndLeave"
      :cancel="cancelLeave"
      :class="{ 'is-active': showUnsavedModal }"
    />
  </div>
</template>
