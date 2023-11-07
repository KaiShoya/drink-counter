<script setup lang="ts">
import { showSuccessToast, showDangerToast } from '~/composables/toast'
import { useDrinksStore } from '~/store/data/drinks'

const route = useRoute()

const { $i18n } = useNuxtApp()

const drinksStore = useDrinksStore()
const { fetchDrinks, findDrink, updateDrink, createDrink } = drinksStore

await fetchDrinks()

const name = useState<string>(() => '')
const color = useState<string | null>(() => null)

const drinkId = Number(route.params.id)
const newDrink = useState(() => true)
if (route.params.id === 'new') {
  name.value = ''
  color.value = null
  newDrink.value = true
} else {
  newDrink.value = false
  const drink = findDrink(drinkId)
  if (drink === undefined) {
    showDangerToast($i18n.t('error.GET_RECORD'))
    navigateTo('/drinks')
  } else {
    name.value = drink.name
    color.value = drink.color
  }
}

const create = async () => {
  const error = await createDrink(name.value, color.value)
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    showDangerToast($i18n.t('drinks.create_failure', { name: name.value }))
  } else {
    showSuccessToast($i18n.t('drinks.create_success', { name: name.value }))
    navigateTo('/drinks')
  }
}

const updateDrinkById = async () => {
  const error = await updateDrink(drinkId, name.value, color.value)
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    showDangerToast($i18n.t('drinks.update_failure', { name: name.value }))
  } else {
    showSuccessToast($i18n.t('drinks.update_success', { name: name.value }))
    navigateTo('/drinks')
  }
}
</script>

<template>
  <div>
    <div class="field">
      <label class="label">{{ $t('drinks.name') }}</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="name"
          class="input"
          type="text"
          placeholder="ビール"
        >
      </div>
    </div>

    <div class="field">
      <label class="label">{{ $t('drinks.color') }}</label>
      <div class="control has-icons-left has-icons-right">
        <input
          v-model="color"
          class="input"
          type="text"
          placeholder="ffffff"
        >
      </div>
    </div>

    <div>
      <button
        class="button"
        @click="newDrink ? create() : updateDrinkById()"
      >
        {{ newDrink ? $t('drinks.add') : $t('drinks.update') }}
      </button>

      <NuxtLink
        to="/drinks"
        class="button"
      >
        {{ $t('drinks.cancel') }}
      </NuxtLink>
    </div>
  </div>
</template>
