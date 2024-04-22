<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'
import type { DrinkLabel } from '~/store/data/types/drinkLabel'

const drinkLabelsStore = useDrinkLabelsStore()
const { drinkLabels } = storeToRefs(drinkLabelsStore)
const { findById } = drinkLabelsStore

defineProps<{
  saveFunction: Function,
  save: 'drinks.update' | 'drinks.add',
}>()
const drinkLabelId = defineModel<number | null>('drinkLabelId')
const name = defineModel<string | null>('name')
const color = defineModel<string | null>('color')
const amount = defineModel<number | null>('amount')

const selectedLabel = ref<DrinkLabel | null | undefined>(drinkLabelId.value ? findById(drinkLabelId.value) : undefined)

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
      <label class="label">{{ $t('drinks.drink_label') }}</label>
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
        <div class="column select is-fullwidth">
          <select @change="changeDrinkLabelId(Number(($event.target as HTMLInputElement).value))">
            <option
              key=""
              :value="null"
              label="選択してください"
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

    <div class="field">
      <label class="label">{{ $t('drinks.name') }}</label>
      <div class="control">
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
            {{ $t('drinks.copy_label_color') }}
          </button>
          <button
            v-else
            class="button"
            disabled
          >
            {{ $t('drinks.copy_label_color') }}
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
            <span class="icon is-medium">
              <i class="mdi mdi-cached mdi-24px" />
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">
        {{ $t('drinks.amount') }}
        {{ $t('drinks.standard_amount') }}
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
        {{ $t(save) }}
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
