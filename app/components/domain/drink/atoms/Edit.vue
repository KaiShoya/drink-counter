<script setup lang="ts">
import { LOCALE_DRINKS_AMOUNT, LOCALE_DRINKS_CANCEL, LOCALE_DRINKS_COLOR, LOCALE_DRINKS_COPY_LABEL_COLOR, LOCALE_DRINKS_DRINK_LABEL, LOCALE_DRINKS_NAME, LOCALE_DRINKS_NAME_PLACEHOLDER, LOCALE_DRINKS_SELECT, LOCALE_DRINKS_STANDARD_AMOUNT } from '~/utils/locales'
import { generateRandomColor } from '~/utils/common'
import type { DrinkLabelWithDefaultColor } from '~/app/repositories/drinkLabelsRepository'

const { t } = useI18n()
const localePath = useLocalePath()

const drinkLabelsStore = useDrinkLabelsStore()
const { drinkLabels } = storeToRefs(drinkLabelsStore)
const { findById } = drinkLabelsStore

defineProps<{
  saveFunction: () => void
  save: typeof LOCALE_DRINKS_UPDATE | typeof LOCALE_DRINKS_ADD
}>()
const drinkLabelId = defineModel<number | null>('drinkLabelId')
const name = defineModel<string | null>('name')
const color = defineModel<string | null>('color')
const amount = defineModel<number | null>('amount')

const selectedLabel = ref<DrinkLabelWithDefaultColor | null | undefined>(drinkLabelId.value ? findById(drinkLabelId.value) : undefined)

const changeDrinkLabelId = (id: number | null) => {
  drinkLabelId.value = id
  if (id) {
    selectedLabel.value = findById(id)
    amount.value = selectedLabel.value?.standard_amount
  } else {
    selectedLabel.value = null
  }
}
</script>

<template>
  <div>
    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_DRINK_LABEL) }}</label>
      <div
        class="control columns is-vcentered is-mobile"
        style="margin-left: 12px;"
      >
        <div
          v-if="selectedLabel"
          class="column tag"
          :style="{ flex: 'none', padding: '10px', width: '50px', border: '1px solid', backgroundColor: selectedLabel!.color ?? selectedLabel!.default_color }"
        />
        <div
          v-else
          class="column tag"
          :style="{ flex: 'none', padding: '10px', width: '50px', border: '1px solid' }"
        />
        <div class="column">
          <div class="select is-fullwidth">
            <select @change="changeDrinkLabelId(Number(($event.target as HTMLInputElement).value))">
              <option
                key=""
                :value="null"
                :label="t(LOCALE_DRINKS_SELECT)"
                :selected="drinkLabelId === null"
              />
              <option
                v-for="label in drinkLabels"
                :key="label.id"
                :value="label.id"
                :label="label.name"
                :selected="drinkLabelId === label.id"
              />
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_NAME) }}</label>
      <div class="control">
        <input
          v-model="name"
          class="input"
          type="text"
          :placeholder="t(LOCALE_DRINKS_NAME_PLACEHOLDER)"
        >
      </div>
    </div>

    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_COLOR) }}</label>
      <div class="control columns is-vcentered is-mobile">
        <div
          class="column"
          style="flex: none; margin-left: 12px;"
        >
          <input
            v-model="color"
            type="color"
          >
        </div>
        <input
          v-model="color"
          class="input column"
          type="text"
          placeholder="#000000"
        >

        <div
          class="column"
          style="flex: none; margin-right: -12px;"
        >
          <button
            v-if="selectedLabel"
            class="button"
            @click="color = selectedLabel!.color"
          >
            {{ t(LOCALE_DRINKS_COPY_LABEL_COLOR) }}
          </button>
          <button
            v-else
            class="button"
            disabled
          >
            {{ t(LOCALE_DRINKS_COPY_LABEL_COLOR) }}
          </button>
        </div>

        <div
          class="column"
          style="flex: none; margin-right: 12px;"
        >
          <button
            class="button"
            @click="color = generateRandomColor()"
          >
            <Icon
              name="mdi:cached"
              class="icon"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">
        {{ t(LOCALE_DRINKS_AMOUNT) }}
        {{ t(LOCALE_DRINKS_STANDARD_AMOUNT) }}
        {{ selectedLabel?.standard_amount }}
      </label>
      <div class="control">
        <input
          v-model="amount"
          class="input"
          type="number"
          placeholder="1"
        >
      </div>
    </div>

    <div>
      <button
        class="button"
        @click="saveFunction()"
      >
        {{ t(save) }}
      </button>

      <NuxtLink
        :to="localePath('/drinks')"
        class="button"
      >
        {{ t(LOCALE_DRINKS_CANCEL) }}
      </NuxtLink>
    </div>
  </div>
</template>
