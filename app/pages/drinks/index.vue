<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
useSeoMeta({
  title: t(LOCALE_ROUTES_DRINKS),
})

const localePath = useLocalePath()

const pageDrinksStore = usePageDrinksStore()
const { deleteTarget, showDeleteModal } = storeToRefs(pageDrinksStore)
const { initPage, updateHidden, deleteDrink, clickDeleteDrinkButton, save } = pageDrinksStore
const drinksStore = useDrinksStore()
const { drinks } = storeToRefs(drinksStore)
const drinkLabelsStore = useDrinkLabelsStore()
const { findById } = drinkLabelsStore

initPage()
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
    >
      <template #header>
        <div class="columns is-mobile title is-6 border-line">
          <div class="column is-1" />
          <div class="column is-2">
            {{ $t(LOCALE_DRINKS_DRINK_LABEL) }}
          </div>
          <div class="column is-3">
            {{ $t(LOCALE_DRINKS_NAME) }}
          </div>
          <div class="column is-1">
            {{ $t(LOCALE_DRINKS_COLOR) }}
          </div>
          <div class="column">
            {{ $t(LOCALE_DRINKS_AMOUNT) }}
          </div>
        </div>
      </template>

      <template #item="{ element: drink }">
        <div class="columns is-mobile border-line is-vcentered">
          <div
            class="column is-1"
            style="display: flex;"
          >
            <div class="handle mr-2">
              <Icon
                name="mdi:drag-horizontal-variant"
                class="icon is-small"
              />
            </div>
          </div>
          <div
            class="column is-2"
            style="display: flex;"
          >
            {{ drink.drink_label_id ? findById(drink.drink_label_id)?.name : '' }}
          </div>

          <div
            class="column is-3"
            style="display: flex;"
          >
            {{ drink.name }}
          </div>

          <div
            class="column is-1 is-vcentered is-mobile"
            style="display: flex;"
          >
            <div
              class="mx-1 tag"
              :style="{ padding: '10px', backgroundColor: drink.color }"
            />
          </div>

          <div
            class="column is-2"
            style="display: flex;"
          >
            {{ drink.amount }}
          </div>

          <div class="column columns is-mobile is-3">
            <NuxtLink
              :to="localePath(`/drinks/${drink.id}`)"
              class="icon has-text-info"
            >
              <Icon
                name="mdi:text-box-edit-outline"
                class="icon"
              />
            </NuxtLink>

            <span
              :class="['icon', 'mx-1', drink.visible ? 'has-text-primary' : 'has-text-dark']"
              @click="updateHidden(drink)"
            >
              <Icon
                v-if="drink.visible"
                name="mdi:eye"
                class="icon"
              />
              <Icon
                v-else
                name="mdi:eye-off"
                class="icon"
              />
            </span>

            <span
              class="icon has-text-danger"
              @click="clickDeleteDrinkButton(drink)"
            >
              <Icon
                name="mdi:delete-forever-outline"
                class="icon"
              />
            </span>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          class="button mr-3"
          @click="save"
        >
          {{ $t(LOCALE_DRINKS_SAVE_SORT) }}
        </button>

        <NuxtLink
          :to="localePath('/drinks/new')"
          class="button is-primary"
        >
          {{ $t(LOCALE_DRINKS_ADD) }}
        </NuxtLink>
      </template>
    </draggable>

    <CommonModalMoleculesDanger
      :title="$t(LOCALE_DRINKS_DELETE_MODAL_TITLE, { name: deleteTarget?.name })"
      :content="$t(LOCALE_DRINKS_DELETE_MODAL_CONTENT, { name: deleteTarget?.name })"
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
