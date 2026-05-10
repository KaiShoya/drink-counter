<script setup lang="ts">
import {
  LOCALE_LABELS_EDIT_TITLE,
  LOCALE_DRINKS_UNSAVED_FORM_CONFIRM,
  LOCALE_LABELS_DRINKS_SECTION_TITLE,
  LOCALE_LABELS_DRINKS_EMPTY,
  LOCALE_LABELS_DRINKS_ADD,
  LOCALE_DRINKS_EDIT_TITLE,
  LOCALE_DRINKS_NEW_TITLE,
  LOCALE_LABELS_SAVE_SORT,
  LOCALE_LABELS_UNSAVED_SORT_CONFIRM,
  LOCALE_DRINKS_NAME,
  LOCALE_DRINKS_COLOR,
  LOCALE_DRINKS_AMOUNT,
  LOCALE_DRINKS_ACTIONS_HEADER,
  LOCALE_DRINKS_DELETE_MODAL_TITLE,
  LOCALE_DRINKS_DELETE_MODAL_CONTENT,
  LOCALE_MODAL_UNSAVED_TITLE,
} from '~/utils/locales'
import type { DrinkRow } from '~/repositories/drinksRepository'

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const {
  drinkLabelId, name: labelName, color: labelColor, standardAmount, isSaving,
  hasUnsavedSort, deleteTarget, showDeleteModal, filteredDrinks,
} = storeToRefs(drinkLabelEditStore)
const { initPage, update, updateHidden, clickDeleteDrinkButton, deleteDrink, onDragEnd, saveSort } = drinkLabelEditStore

const drinksStore = useDrinksStore()
const { resetSort } = drinksStore

const drinkEditStore = usePageDrinkEditStore()
const {
  name: editName,
  color: editColor,
  amount: editAmount,
  drinkLabelId: editDrinkLabelId,
  isSaving: isDrinkEditSaving,
} = storeToRefs(drinkEditStore)
const { initPage: initDrinkEditPage, updateDrinkById } = drinkEditStore

const drinkNewStore = usePageDrinkNewStore()
const {
  name: newName,
  color: newColor,
  amount: newAmount,
  drinkLabelId: newDrinkLabelId,
  isSaving: isDrinkNewSaving,
} = storeToRefs(drinkNewStore)
const { initPage: initDrinkNewPage, create: createDrink } = drinkNewStore

const drinkModalMode = ref<'edit' | 'new' | null>(null)
const editTargetDrinkName = ref<string>('')
const isDrinkModalActive = computed(() => drinkModalMode.value !== null)

const closeDrinkModal = () => {
  drinkModalMode.value = null
  editTargetDrinkName.value = ''
}

const openDrinkEditModal = async (drink: DrinkRow) => {
  await initDrinkEditPage(drink.id)
  editTargetDrinkName.value = drink.name
  drinkModalMode.value = 'edit'
}

const openDrinkNewModal = async () => {
  await initDrinkNewPage()
  newDrinkLabelId.value = drinkLabelId.value
  drinkModalMode.value = 'new'
}

const saveDrinkEditInModal = async () => {
  await updateDrinkById(null)
  closeDrinkModal()
}

const saveDrinkNewInModal = async () => {
  await createDrink(null)
  closeDrinkModal()
}

initPage()

const { t } = useI18n()
useSeoMeta({
  title: computed(() => t(LOCALE_LABELS_EDIT_TITLE, { name: labelName.value ?? '' })),
})

const drinkModalTitle = computed(() => {
  if (drinkModalMode.value === 'edit') {
    const resolvedName = editTargetDrinkName.value || editName.value
    return t(LOCALE_DRINKS_EDIT_TITLE, { name: resolvedName ?? '' })
  }
  return t(LOCALE_DRINKS_NEW_TITLE)
})

type Snapshot = { name: string; color: string | null; standardAmount: number }
const initial = ref<Snapshot | null>(null)

onMounted(() => {
  initial.value = { name: labelName.value, color: labelColor.value, standardAmount: standardAmount.value }
})

const isDirty = computed(() =>
  initial.value !== null && (
    labelName.value !== initial.value.name ||
    labelColor.value !== initial.value.color ||
    standardAmount.value !== initial.value.standardAmount
  ),
)

const unsavedModalContent = computed(() => {
  return hasUnsavedSort.value
    ? t(LOCALE_LABELS_UNSAVED_SORT_CONFIRM)
    : t(LOCALE_DRINKS_UNSAVED_FORM_CONFIRM)
})

const { showUnsavedModal, discardAndLeave, cancelLeave } = useUnsavedChangesGuard({
  isDirty: () => isDirty.value || hasUnsavedSort.value,
  canSkip: () => isSaving.value,
  onDiscard: () => {
    if (hasUnsavedSort.value) {
      resetSort()
    }
  },
})
</script>

<template>
  <div>
    <h2 class="title is-5">
      {{ t(LOCALE_LABELS_EDIT_TITLE, { name: labelName }) }}
    </h2>
    <DomainLabelAtomsEdit
      v-model:name="labelName"
      v-model:color="labelColor"
      v-model:standard-amount="standardAmount"
      :save-function="update"
      :is-saving="isSaving"
      save="drinks.update"
    />

    <hr>

    <h3 class="title is-6 mt-4">
      {{ t(LOCALE_LABELS_DRINKS_SECTION_TITLE) }}
    </h3>

    <div
      v-if="filteredDrinks.length === 0"
      class="has-text-grey my-4"
    >
      <p>{{ t(LOCALE_LABELS_DRINKS_EMPTY) }}</p>
      <button
        class="button is-primary is-small mt-2"
        @click="openDrinkNewModal"
      >
        {{ t(LOCALE_LABELS_DRINKS_ADD) }}
      </button>
    </div>

    <div
      v-else
      class="mx-2"
    >
      <draggable
        v-model="filteredDrinks"
        :delay="100"
        :delay-on-touch-only="true"
        :touch-start-threshold="35"
        handle=".handle"
        group="label-drinks"
        item-key="id"
        @end="onDragEnd"
      >
        <template #header>
          <div class="columns is-mobile title is-6 border-line mb-0">
            <div class="column is-1" />
            <div class="column is-4">
              {{ t(LOCALE_DRINKS_NAME) }}
            </div>
            <div class="column is-1">
              {{ t(LOCALE_DRINKS_COLOR) }}
            </div>
            <div class="column is-3">
              {{ t(LOCALE_DRINKS_AMOUNT) }}
            </div>
            <div class="column">
              {{ t(LOCALE_DRINKS_ACTIONS_HEADER) }}
            </div>
          </div>
        </template>

        <template #item="{ element: drink }">
          <div class="columns is-mobile border-line is-vcentered">
            <div class="column is-1 is-flex">
              <div
                class="handle mr-2"
                style="min-height: 44px; display: flex; align-items: center;"
              >
                <Icon
                  name="mdi:drag-horizontal-variant"
                  class="icon is-small"
                />
              </div>
            </div>
            <div class="column is-4 is-flex">
              {{ drink.name }}
            </div>
            <div class="column is-1 is-flex is-vcentered">
              <div
                class="mx-1 tag"
                :style="{ padding: '10px', backgroundColor: drink.color ?? drink.default_color }"
              />
            </div>
            <div class="column is-3 is-flex">
              {{ drink.amount }}
            </div>
            <div class="column is-flex is-align-items-center">
              <button
                class="button is-ghost p-1 has-text-info"
                @click="openDrinkEditModal(drink)"
              >
                <Icon
                  name="mdi:text-box-edit-outline"
                  size="20"
                />
              </button>

              <button
                :class="['button', 'is-ghost', 'p-1', drink.visible ? 'has-text-primary' : 'has-text-dark']"
                @click="updateHidden(drink)"
              >
                <Icon
                  v-if="drink.visible"
                  name="mdi:eye"
                  size="20"
                />
                <Icon
                  v-else
                  name="mdi:eye-off"
                  size="20"
                />
              </button>

              <button
                class="button is-ghost p-1 has-text-danger"
                @click="clickDeleteDrinkButton(drink)"
              >
                <Icon
                  name="mdi:delete-forever-outline"
                  size="20"
                />
              </button>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="mt-3">
            <button
              class="button mr-3"
              @click="saveSort"
            >
              {{ t(LOCALE_LABELS_SAVE_SORT) }}
            </button>
            <button
              class="button is-primary"
              @click="openDrinkNewModal"
            >
              {{ t(LOCALE_LABELS_DRINKS_ADD) }}
            </button>
          </div>
        </template>
      </draggable>
    </div>

    <div
      class="modal"
      :class="{ 'is-active': isDrinkModalActive }"
    >
      <div
        class="modal-background"
        @click="closeDrinkModal"
      />
      <div class="modal-card drink-form-modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ drinkModalTitle }}
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="closeDrinkModal"
          />
        </header>

        <section class="modal-card-body">
          <DomainDrinkAtomsEdit
            v-if="drinkModalMode === 'edit'"
            v-model:name="editName"
            v-model:color="editColor"
            v-model:amount="editAmount"
            v-model:drink-label-id="editDrinkLabelId"
            :save-function="saveDrinkEditInModal"
            :is-saving="isDrinkEditSaving"
            :cancel-function="closeDrinkModal"
            save="drinks.update"
          />

          <DomainDrinkAtomsEdit
            v-else-if="drinkModalMode === 'new'"
            v-model:name="newName"
            v-model:color="newColor"
            v-model:amount="newAmount"
            v-model:drink-label-id="newDrinkLabelId"
            :save-function="saveDrinkNewInModal"
            :is-saving="isDrinkNewSaving"
            :cancel-function="closeDrinkModal"
            save="drinks.add"
          />
        </section>
      </div>
    </div>

    <CommonModalMoleculesDanger
      :title="t(LOCALE_DRINKS_DELETE_MODAL_TITLE, { name: deleteTarget?.name })"
      :content="t(LOCALE_DRINKS_DELETE_MODAL_CONTENT, { name: deleteTarget?.name })"
      :success="() => deleteDrink(deleteTarget?.id, deleteTarget?.name)"
      :cancel="() => showDeleteModal = false"
      :class="{ 'is-active': showDeleteModal }"
    />

    <CommonModalMoleculesUnsavedChanges
      :title="t(LOCALE_MODAL_UNSAVED_TITLE)"
      :content="unsavedModalContent"
      :discard="discardAndLeave"
      :cancel="cancelLeave"
      :class="{ 'is-active': showUnsavedModal }"
    />
  </div>
</template>

<style scoped>
.border-line {
  border-bottom: solid 1px #aaaaaa;
}

.drink-form-modal-card {
  width: min(840px, calc(100vw - 2rem));
}
</style>
