<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { LOCALE_DRINKS_DRINK_LABEL, LOCALE_DRINKS_NAME, LOCALE_DRINKS_COLOR, LOCALE_DRINKS_AMOUNT, LOCALE_DRINKS_SAVE_SORT, LOCALE_DRINKS_ADD, LOCALE_DRINKS_DELETE_MODAL_TITLE, LOCALE_DRINKS_DELETE_MODAL_CONTENT, LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, LOCALE_DRINKS_DELETE_SUCCESS, LOCALE_DRINKS_SORT_SUCCESS } from '~/utils/locales'

const props = defineProps<{ labelId: number | null }>()

const { t } = useI18n()
const localePath = useLocalePath()

const drinksStore = useDrinksStore()
const { drinks } = storeToRefs(drinksStore)

const deleteTarget = ref(null as any)
const showDeleteModal = ref(false)

const fetch = async () => {
  await drinksStore.fetchDrinksByLabel(props.labelId ?? null)
}

onMounted(fetch)
watch(() => props.labelId, fetch)

const updateHidden = async (drink: any) => {
  await drinksStore.updateDrinkVisible(drink.id, !drink.visible)
  showSuccessToast(t(LOCALE_DRINKS_UPDATE_VISIBLE_SUCCESS, { name: drink.name, status: t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
}

const clickDeleteDrinkButton = (drink: any) => {
  deleteTarget.value = drink
  showDeleteModal.value = true
}

const deleteDrink = async () => {
  if (!deleteTarget.value) return
  await drinksStore.deleteDrinkById(deleteTarget.value.id, deleteTarget.value.name)
  showSuccessToast(t(LOCALE_DRINKS_DELETE_SUCCESS, { name: deleteTarget.value.name }))
  showDeleteModal.value = false
  await fetch()
}

const save = async () => {
  await drinksStore.updateDrinksSortByLabel(props.labelId ?? null)
  showSuccessToast(t(LOCALE_DRINKS_SORT_SUCCESS))
}
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
          <div class="column is-3">{{ t(LOCALE_DRINKS_NAME) }}</div>
          <div class="column is-1">{{ t(LOCALE_DRINKS_COLOR) }}</div>
          <div class="column">{{ t(LOCALE_DRINKS_AMOUNT) }}</div>
          <div class="column is-3" />
        </div>
      </template>

      <template #item="{ element: drink }">
        <div class="columns is-mobile border-line is-vcentered">
          <div class="column is-1" style="display:flex;">
            <div class="handle mr-2">
              <Icon name="mdi:drag-horizontal-variant" class="icon is-small" />
            </div>
          </div>

          <div class="column is-3" style="display:flex;">{{ drink.name }}</div>

          <div class="column is-1 is-vcentered is-mobile" style="display:flex;">
            <div class="mx-1 tag" :style="{ padding: '10px', backgroundColor: drink.color }" />
          </div>

          <div class="column is-2" style="display:flex;">{{ drink.amount }}</div>

          <div class="column columns is-mobile is-3">
            <NuxtLink :to="localePath(`/labels/${props.labelId}/drinks/${drink.id}`)" class="icon has-text-info">
              <Icon name="mdi:text-box-edit-outline" class="icon" />
            </NuxtLink>

            <span :class="['icon', 'mx-1', drink.visible ? 'has-text-primary' : 'has-text-dark']" @click="updateHidden(drink)">
              <Icon v-if="drink.visible" name="mdi:eye" class="icon" />
              <Icon v-else name="mdi:eye-off" class="icon" />
            </span>

            <span class="icon has-text-danger" @click="clickDeleteDrinkButton(drink)">
              <Icon name="mdi:delete-forever-outline" class="icon" />
            </span>
          </div>
        </div>
      </template>

      <template #footer>
        <button class="button mr-3" @click="save">{{ t(LOCALE_DRINKS_SAVE_SORT) }}</button>

        <NuxtLink :to="localePath(`/drinks/new`)+`?drink_label_id=${props.labelId ?? ''}`" class="button is-primary">
          {{ t(LOCALE_DRINKS_ADD) }}
        </NuxtLink>
      </template>
    </draggable>

    <CommonModalMoleculesDanger
      :title="t(LOCALE_DRINKS_DELETE_MODAL_TITLE, { name: deleteTarget?.name })"
      :content="t(LOCALE_DRINKS_DELETE_MODAL_CONTENT, { name: deleteTarget?.name })"
      :success="deleteDrink"
      :cancel="() => (showDeleteModal = false)"
      :class="{ 'is-active': showDeleteModal }"
    />
  </div>
</template>

<style scoped>
.border-line {
  border-bottom: solid 1px #aaaaaa;
}
</style>
