<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDrinksStore } from '~/store/data/drinks'
import type { Drink } from '~/store/data/types/drink'
import { showSuccessToast, showDangerToast } from '~/composables/toast'

const localePath = useLocalePath()

const { $i18n } = useNuxtApp()

const modalIsActive = useState(() => false)

const drinksStore = useDrinksStore()
const { drinks } = storeToRefs(drinksStore)
const { fetchDrinks, updateDrinkVisible, deleteDrinkById } = drinksStore

fetchDrinks()

const updateHidden = async (drink: Drink) => {
  const error = await updateDrinkVisible(drink.id, !drink.visible)
  if (error) {
    console.log(error)
    showDangerToast($i18n.t('drinks.update_failure', { name: drink.name }))
    return
  }
  showSuccessToast($i18n.t('drinks.update_visible_success', { name: drink.name, status: $i18n.t(`drinks.${drink.visible ? 'visible' : 'invisible'}`) }))
}

const deleteTarget = useState<Drink | null>(() => null)
const clickDeleteDrinkButton = (drink: Drink) => {
  deleteTarget.value = drink
  modalIsActive.value = true
}

const deleteDrink = async (drinkId: number | undefined, drinkName: string | undefined) => {
  if (drinkId === undefined || drinkName === undefined) {
    showDangerToast($i18n.t('error.GET_RECORD'))
    modalIsActive.value = false
    return
  }
  const error = await deleteDrinkById(drinkId)
  if (error) {
    console.log(error)
    showDangerToast($i18n.t('drinks.delete_failure', { name: drinkName }))
    modalIsActive.value = false
    return
  }
  showSuccessToast($i18n.t('drinks.delete_success', { name: drinkName }))
  modalIsActive.value = false
}
</script>

<template>
  <div>
    <table class="table is-hoverable is-fullwidth is-striped">
      <thead>
        <tr>
          <th>{{ $t('drinks.name') }}</th>
          <th>{{ $t('drinks.color') }}</th>
          <th class="is-1" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="drink of drinks"
          :key="drink.id"
        >
          <td>{{ drink.name }}</td>
          <td>{{ drink.color }}</td>
          <td>
            <NuxtLink :to="localePath(`/drinks/${drink.id}`)">
              <span class="icon has-text-info">
                <i class="mdi mdi-24px mdi-text-box-edit-outline" />
              </span>
            </NuxtLink>

            <span
              :class="['icon', drink.visible ? 'has-text-primary' : 'has-text-dark']"
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
          </td>
        </tr>
      </tbody>
    </table>

    <NuxtLink
      to="/drinks/new"
      class="button is-primary"
    >
      {{ $t('drinks.add') }}
    </NuxtLink>

    <DrinksDangerModal
      :title="$t('drinks.delete_modal_title', { name: deleteTarget?.name })"
      :content="$t('drinks.delete_modal_content', { name: deleteTarget?.name })"
      :success="() => { deleteDrink(deleteTarget?.id, deleteTarget?.name) }"
      :cancel="() => modalIsActive = false"
      :class="{ 'is-active': modalIsActive }"
    />
  </div>
</template>
