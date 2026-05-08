<script setup lang="ts">
import { LOCALE_ROUTES_DRINKS, LOCALE_DRINKS_ACTIONS_HEADER, LOCALE_DRINKS_DRINK_LABEL, LOCALE_DRINKS_NAME, LOCALE_DRINKS_COLOR, LOCALE_DRINKS_AMOUNT, LOCALE_DRINKS_SAVE_SORT, LOCALE_DRINKS_UNSAVED_SORT_CONFIRM, LOCALE_DRINKS_ADD, LOCALE_DRINKS_DELETE_MODAL_TITLE, LOCALE_DRINKS_DELETE_MODAL_CONTENT } from '~/utils/locales'

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_DRINKS),
})

const localePath = useLocalePath()

const pageDrinksStore = usePageDrinksStore()
const { deleteTarget, showDeleteModal, hasUnsavedSort } = storeToRefs(pageDrinksStore)
const { updateHidden, deleteDrink, clickDeleteDrinkButton, save } = pageDrinksStore

const drinksStore = useDrinksStore()
const { drinks } = storeToRefs(drinksStore)
const drinkLabelsStore = useDrinkLabelsStore()
const { findById } = drinkLabelsStore

// ドラッグ完了時に未保存状態をセット
const onDragEnd = () => { hasUnsavedSort.value = true }

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (hasUnsavedSort.value) { e.preventDefault() }
}

onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

onBeforeRouteLeave(() => {
  if (hasUnsavedSort.value) {
    return window.confirm(t(LOCALE_DRINKS_UNSAVED_SORT_CONFIRM))
  }
})
</script>

<template>
  <div class="mx-2">
    <draggable
      v-model="drinks"
      :delay="100"
      :delay-on-touch-only="true"
      :touch-start-threshold="35"
      handle=".handle"
      group="drinks"
      item-key="id"
      @end="onDragEnd"
    >
      <template #header>
        <div class="columns is-mobile title is-6 border-line">
          <div class="column is-1" />
          <div class="column is-2">
            {{ t(LOCALE_DRINKS_DRINK_LABEL) }}
          </div>
          <div class="column is-3">
            {{ t(LOCALE_DRINKS_NAME) }}
          </div>
          <div class="column is-1">
            {{ t(LOCALE_DRINKS_COLOR) }}
          </div>
          <div class="column">
            {{ t(LOCALE_DRINKS_AMOUNT) }}
          </div>
          <div class="column is-3">
            {{ t(LOCALE_DRINKS_ACTIONS_HEADER) }}
          </div>
        </div>
      </template>

      <template #item="{ element: drink }">
        <div class="columns is-mobile border-line is-vcentered">
          <div
              class="column is-1 is-flex"
          >
            <div class="handle mr-2">
              <Icon
                name="mdi:drag-horizontal-variant"
                class="icon is-small"
              />
            </div>
          </div>
          <div
              class="column is-2 is-flex"
          >
            {{ drink.drink_label_id ? findById(drink.drink_label_id)?.name : '' }}
          </div>

          <div
              class="column is-3 is-flex"
          >
            {{ drink.name }}
          </div>

          <div
              class="column is-1 is-vcentered is-mobile is-flex"
          >
            <div
              class="mx-1 tag"
              :style="{ padding: '10px', backgroundColor: drink.color }"
            />
          </div>

          <div
              class="column is-2 is-flex"
          >
            {{ drink.amount }}
          </div>

          <div class="column is-3 is-flex is-align-items-center">
            <NuxtLink
              :to="localePath(`/drinks/${drink.id}`)"
              class="button is-ghost p-1 has-text-info"
            >
              <Icon name="mdi:text-box-edit-outline" size="20" />
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
              <Icon name="mdi:delete-forever-outline" size="20" />
            </button>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          class="button mr-3"
          @click="save"
        >
          {{ t(LOCALE_DRINKS_SAVE_SORT) }}
        </button>

        <NuxtLink
          :to="localePath('/drinks/new')"
          class="button is-primary"
        >
          {{ t(LOCALE_DRINKS_ADD) }}
        </NuxtLink>
      </template>
    </draggable>

    <CommonModalMoleculesDanger
      :title="t(LOCALE_DRINKS_DELETE_MODAL_TITLE, { name: deleteTarget?.name })"
      :content="t(LOCALE_DRINKS_DELETE_MODAL_CONTENT, { name: deleteTarget?.name })"
      :success="() => { deleteDrink(deleteTarget?.id, deleteTarget?.name) }"
      :cancel="() => showDeleteModal = false"
      :class="{ 'is-active': showDeleteModal }"
    />
  </div>
</template>

<style scoped>
.border-line {
  border-bottom: solid 1px #aaaaaa;
}

.color-column {
  flex: 'none';
  margin-bottom: -0.75rem;
}
</style>
