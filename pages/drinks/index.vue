<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinksStore } from '~/store/pages/drinks/index'
import { useDrinksStore } from '~/store/data/drinks'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

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
      handle=".handle"
      group="drinks"
      item-key="id"
    >
      <template #header>
        <div class="columns is-mobile title is-6 border-line">
          <div class="column is-4">
            {{ $t('drinks.name') }}
          </div>
          <div class="column is-1">
            {{ $t('drinks.color') }}
          </div>
          <div class="column is-2">
            {{ $t('drinks.amount') }}
          </div>
          <div class="column is-2">
            {{ $t('drinks.drink_label') }}
          </div>
          <div class="column is-3" />
        </div>
      </template>

      <template #item="{ element: drink }">
        <div class="columns is-mobile border-line is-vcentered">
          <div
            class="column is-4"
            style="display: flex;"
          >
            <div class="handle mr-2">
              <i class="mdi mdi-drag-horizontal-variant" />
            </div>
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

          <div
            class="column is-2"
            style="display: flex;"
          >
            {{ drink.drink_label_id ? findById(drink.drink_label_id)?.name : '' }}
          </div>

          <div class="column columns is-mobile is-3">
            <NuxtLink
              :to="localePath(`/drinks/${drink.id}`)"
              class="icon has-text-info"
            >
              <i class="mdi mdi-24px mdi-text-box-edit-outline" />
            </NuxtLink>

            <span
              :class="['icon', 'mx-1', drink.visible ? 'has-text-primary' : 'has-text-dark']"
              @click="updateHidden(drink)"
            >
              <i
                v-if="drink.visible"
                class="mdi mdi-24px mdi-eye"
              />
              <i
                v-else
                class="mdi mdi-24px mdi-eye-off"
              />
            </span>

            <span
              class="icon has-text-danger"
              @click="clickDeleteDrinkButton(drink)"
            >
              <i class="mdi mdi-24px mdi-delete-forever-outline" />
            </span>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          class="button mr-3"
          @click="save"
        >
          {{ $t('drinks.save_sort') }}
        </button>

        <NuxtLink
          to="/drinks/new"
          class="button is-primary"
        >
          {{ $t('drinks.add') }}
        </NuxtLink>
      </template>
    </draggable>

    <ShareDangerModal
      :title="$t('drinks.delete_modal_title', { name: deleteTarget?.name })"
      :content="$t('drinks.delete_modal_content', { name: deleteTarget?.name })"
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
