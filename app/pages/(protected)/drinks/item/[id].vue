<script setup lang="ts">
import {
  LOCALE_DRINKS_EDIT_TITLE,
  LOCALE_DRINKS_UNSAVED_FORM_CONFIRM,
  LOCALE_MODAL_UNSAVED_TITLE,
} from '~/utils/locales'

const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId, isSaving } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById } = drinkEditStore

initPage()

const { t } = useI18n()
useSeoMeta({
  title: computed(() => t(LOCALE_DRINKS_EDIT_TITLE, { name: name.value ?? '' })),
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

const showUnsavedModal = ref<boolean>(false)
const pendingLeaveResolver = ref<((confirmed: boolean) => void) | null>(null)

const requestLeaveConfirmation = () => {
  showUnsavedModal.value = true
  return new Promise<boolean>((resolve) => {
    pendingLeaveResolver.value = resolve
  })
}

const resolveLeaveConfirmation = (confirmed: boolean) => {
  showUnsavedModal.value = false
  pendingLeaveResolver.value?.(confirmed)
  pendingLeaveResolver.value = null
}

const discardAndLeave = () => resolveLeaveConfirmation(true)
const cancelLeave = () => resolveLeaveConfirmation(false)

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) { e.preventDefault() }
}

onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

onBeforeRouteLeave(async () => {
  // isSaving 中は保存後の navigateTo なのでガードをスキップする
  if (!isSaving.value && isDirty.value) {
    return await requestLeaveConfirmation()
  }
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

    <CommonModalMoleculesUnsavedChanges
      :title="t(LOCALE_MODAL_UNSAVED_TITLE)"
      :content="t(LOCALE_DRINKS_UNSAVED_FORM_CONFIRM)"
      :discard="discardAndLeave"
      :cancel="cancelLeave"
      :class="{ 'is-active': showUnsavedModal }"
    />
  </div>
</template>
