<script setup lang="ts">
import { LOCALE_LABELS_EDIT_TITLE, LOCALE_DRINKS_UNSAVED_FORM_CONFIRM } from '~/utils/locales'

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const { name, color, standardAmount, isSaving } = storeToRefs(drinkLabelEditStore)
const { initPage, update } = drinkLabelEditStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: computed(() => t(LOCALE_LABELS_EDIT_TITLE, { name: name.value ?? '' })),
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
