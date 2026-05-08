<script setup lang="ts">
import { LOCALE_DRINKS_NEW_TITLE, LOCALE_DRINKS_UNSAVED_FORM_CONFIRM } from '~/utils/locales'

const drinkNewStore = usePageDrinkNewStore()
const { name, color, amount, drinkLabelId, isSaving } = storeToRefs(drinkNewStore)
const { initPage, create } = drinkNewStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_DRINKS_NEW_TITLE),
})

type Snapshot = { name: string; color: string | null; amount: number; drinkLabelId: number | null }
const initial = ref<Snapshot | null>(null)

onMounted(() => {
  initial.value = { name: name.value, color: color.value, amount: amount.value, drinkLabelId: drinkLabelId.value }
})

const isDirty = computed(() =>
  initial.value !== null && (
    name.value !== initial.value.name ||
    color.value !== initial.value.color ||
    amount.value !== initial.value.amount ||
    drinkLabelId.value !== initial.value.drinkLabelId
  ),
)

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) { e.preventDefault() }
}

onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

onBeforeRouteLeave(() => {
  if (!isSaving.value && isDirty.value) {
    return window.confirm(t(LOCALE_DRINKS_UNSAVED_FORM_CONFIRM))
  }
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
