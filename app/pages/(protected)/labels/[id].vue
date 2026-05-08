<script setup lang="ts">
import {
  LOCALE_LABELS_EDIT_TITLE,
  LOCALE_DRINKS_UNSAVED_FORM_CONFIRM,
  LOCALE_LABELS_DRINKS_SECTION_TITLE,
  LOCALE_LABELS_DRINKS_EMPTY,
  LOCALE_LABELS_DRINKS_ADD,
  LOCALE_LABELS_SAVE_SORT,
  LOCALE_LABELS_UNSAVED_SORT_CONFIRM,
  LOCALE_DRINKS_NAME,
  LOCALE_DRINKS_COLOR,
  LOCALE_DRINKS_AMOUNT,
  LOCALE_DRINKS_ACTIONS_HEADER,
  LOCALE_DRINKS_DELETE_MODAL_TITLE,
  LOCALE_DRINKS_DELETE_MODAL_CONTENT,
} from '~/utils/locales'

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const {
  name, color, standardAmount, isSaving,
  hasUnsavedSort, deleteTarget, showDeleteModal, filteredDrinks,
} = storeToRefs(drinkLabelEditStore)
const { initPage, update, updateHidden, clickDeleteDrinkButton, deleteDrink, onDragEnd, saveSort } = drinkLabelEditStore

const localePath = useLocalePath()
const route = useRoute()

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
  if (isDirty.value || hasUnsavedSort.value) { e.preventDefault() }
}

onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

onBeforeRouteLeave(() => {
  if (!isSaving.value && (isDirty.value || hasUnsavedSort.value)) {
    const msg = hasUnsavedSort.value
      ? t(LOCALE_LABELS_UNSAVED_SORT_CONFIRM)
      : t(LOCALE_DRINKS_UNSAVED_FORM_CONFIRM)
    return window.confirm(msg)
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

    <hr>

    <h3 class="title is-6 mt-4">
      {{ t(LOCALE_LABELS_DRINKS_SECTION_TITLE) }}
    </h3>

    <div
      v-if="filteredDrinks.length === 0"
      class="has-text-grey my-4"
    >
      <p>{{ t(LOCALE_LABELS_DRINKS_EMPTY) }}</p>
      <NuxtLink
        :to="localePath(`/drinks/new`)"
        class="button is-primary is-small mt-2"
      >
        {{ t(LOCALE_LABELS_DRINKS_ADD) }}
      </NuxtLink>
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
              <NuxtLink
                :to="localePath(`/drinks/${drink.id}`)"
                class="button is-ghost p-1 has-text-info"
              >
                <Icon
                  name="mdi:text-box-edit-outline"
                  size="20"
                />
              </NuxtLink>

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
            <NuxtLink
              :to="localePath(`/drinks/new`)"
              class="button is-primary"
            >
              {{ t(LOCALE_LABELS_DRINKS_ADD) }}
            </NuxtLink>
          </div>
        </template>
      </draggable>
    </div>

    <CommonModalMoleculesDanger
      :title="t(LOCALE_DRINKS_DELETE_MODAL_TITLE, { name: deleteTarget?.name })"
      :content="t(LOCALE_DRINKS_DELETE_MODAL_CONTENT, { name: deleteTarget?.name })"
      :success="() => deleteDrink(deleteTarget?.id, deleteTarget?.name)"
      :cancel="() => showDeleteModal = false"
      :class="{ 'is-active': showDeleteModal }"
    />
  </div>
</template>

<style scoped>
.border-line {
  border-bottom: solid 1px #aaaaaa;
}
</style>
