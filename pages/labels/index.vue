<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkLabelsStore } from '~/store/pages/labels/index'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

const localePath = useLocalePath()

const pageDrinkLabelsStore = usePageDrinkLabelsStore()
const { deleteTarget, showDeleteModal } = storeToRefs(pageDrinkLabelsStore)
const { initPage, updateHidden, deleteDrinkLabel, clickDeleteDrinkButton, saveSort } = pageDrinkLabelsStore
const drinkLabelsStore = useDrinkLabelsStore()
const { drinkLabels } = storeToRefs(drinkLabelsStore)

initPage()
</script>

<template>
  <div class="mx-2">
    <draggable
      v-model="drinkLabels"
      :delay="100"
      :delay-on-touch-only="true"
      :touch-start-threshold="35"
      handle=".handle"
      group="drinkLabels"
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
          <div class="column is-4">
            {{ $t('labels.standard_amount') }}
          </div>
          <div class="column is-3" />
        </div>
      </template>

      <template #item="{ element: drinkLabel }">
        <div class="columns is-mobile border-line is-vcentered">
          <div
            class="column is-4"
            style="display: flex;"
          >
            <div class="handle mr-2">
              <i class="mdi mdi-drag-horizontal-variant" />
            </div>
            {{ drinkLabel.name }}
          </div>

          <div
            class="column is-1 is-vcentered is-mobile"
            style="display: flex;"
          >
            <div
              class="mx-1 tag"
              :style="{ padding: '10px', backgroundColor: drinkLabel.color }"
            />
            <!-- {{ drink.color }} -->
          </div>

          <div
            class="column is-4 is-vcentered is-mobile"
            style="display: flex;"
          >
            {{ drinkLabel.standard_amount }}
          </div>

          <div class="column columns is-mobile is-3">
            <NuxtLink
              :to="localePath(`/labels/${drinkLabel.id}`)"
              class="icon has-text-info"
            >
              <i class="mdi mdi-24px mdi-text-box-edit-outline" />
            </NuxtLink>

            <span
              :class="['icon', 'mx-1', drinkLabel.visible ? 'has-text-primary' : 'has-text-dark']"
              @click="updateHidden(drinkLabel)"
            >
              <i
                v-if="drinkLabel.visible"
                class="mdi mdi-24px mdi-eye"
              />
              <i
                v-else
                class="mdi mdi-24px mdi-eye-off"
              />
            </span>

            <span
              class="icon has-text-danger"
              @click="clickDeleteDrinkButton(drinkLabel)"
            >
              <i class="mdi mdi-24px mdi-delete-forever-outline" />
            </span>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          class="button mr-3"
          @click="saveSort"
        >
          {{ $t('drinks.save_sort') }}
        </button>

        <NuxtLink
          :to="localePath('/labels/new')"
          class="button is-primary"
        >
          {{ $t('drinks.add') }}
        </NuxtLink>
      </template>
    </draggable>

    <ShareDangerModal
      :title="$t('drinks.delete_modal_title', { name: deleteTarget?.name })"
      :content="$t('drinks.delete_modal_content', { name: deleteTarget?.name })"
      :success="() => { deleteDrinkLabel(deleteTarget?.id, deleteTarget?.name) }"
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
