<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t(LOCALE_ROUTES_LABELS),
})

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
            {{ $t(LOCALE_DRINKS_NAME) }}
          </div>
          <div class="column is-1">
            {{ $t(LOCALE_DRINKS_COLOR) }}
          </div>
          <div class="column is-4">
            {{ $t(LOCALE_LABELS_STANDARD_AMOUNT) }}
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
              <Icon
                name="mdi:drag-horizontal-variant"
                class="is-small"
              />
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
              <Icon name="mdi:text-box-edit-outline" />
            </NuxtLink>

            <span
              :class="['icon', 'mx-1', drinkLabel.visible ? 'has-text-primary' : 'has-text-dark']"
              @click="updateHidden(drinkLabel)"
            >
              <Icon
                v-if="drinkLabel.visible"
                name="mdi:eye"
              />
              <Icon
                v-else
                name="mdi:eye-off"
              />
            </span>

            <span
              class="icon has-text-danger"
              @click="clickDeleteDrinkButton(drinkLabel)"
            >
              <Icon name="mdi:delete-forever-outline" />
            </span>
          </div>
        </div>
      </template>

      <template #footer>
        <button
          class="button mr-3"
          @click="saveSort"
        >
          {{ $t(LOCALE_DRINKS_SAVE_SORT) }}
        </button>

        <NuxtLink
          :to="localePath('/labels/new')"
          class="button is-primary"
        >
          {{ $t(LOCALE_DRINKS_ADD) }}
        </NuxtLink>
      </template>
    </draggable>

    <ShareDangerModal
      :title="$t(LOCALE_DRINKS_DELETE_MODAL_TITLE, { name: deleteTarget?.name })"
      :content="$t(LOCALE_DRINKS_DELETE_MODAL_CONTENT, { name: deleteTarget?.name })"
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
