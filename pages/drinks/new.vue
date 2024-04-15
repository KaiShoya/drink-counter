<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkNewStore } from '~/store/pages/drinks/new'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

const drinkNewStore = usePageDrinkNewStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkNewStore)
const { initPage, create } = drinkNewStore
const drinkLabelsStore = useDrinkLabelsStore()
const { drinkLabels } = storeToRefs(drinkLabelsStore)

initPage()
</script>

<template>
  <div>
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
      <label class="label">{{ $t('drinks.amount') }}</label>
      <div class="control">
        <input
          v-model="amount"
          class="input"
          type="number"
          placeholder="1"
        >
      </div>
    </div>

    <div class="field">
      <label class="label">{{ $t('drinks.drink_label') }}</label>
      <div class="control">
        <div class="select">
          <select @change="drinkLabelId = Number(($event.target as HTMLInputElement).value)">
            <option
              key=""
              value=""
              label="なし"
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

    <div>
      <button
        class="button"
        @click="create()"
      >
        {{ $t('drinks.add') }}
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
