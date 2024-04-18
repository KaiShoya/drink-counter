<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkEditStore } from '~/store/pages/drinks/edit'
import { useDrinkLabelsStore } from '~/store/data/drinkLabels'

const drinkEditStore = usePageDrinkEditStore()
const { name, color, amount, drinkLabelId } = storeToRefs(drinkEditStore)
const { initPage, updateDrinkById } = drinkEditStore
const drinkLabelsStore = useDrinkLabelsStore()
const { drinkLabels } = storeToRefs(drinkLabelsStore)
const { findById } = drinkLabelsStore

initPage()
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
          v-if="drinkLabelId"
          class="column tag"
          :style="{ flex: 'none', padding: '10px', width: '50px', border: '1px solid', backgroundColor: findById(drinkLabelId)!.color ?? findById(drinkLabelId)!.default_color }"
        />
        <div
          v-else
          class="column tag"
          :style="{ flex: 'none', padding: '10px', width: '50px', border: '1px solid' }"
        />
        <div class="column select is-fullwidth">
          <select @change="drinkLabelId = Number(($event.target as HTMLInputElement).value)">
            <option
              key=""
              value=""
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
            v-if="drinkLabelId"
            class="button"
            @click="color = findById(drinkLabelId)!.color"
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

    <div>
      <button
        class="button"
        @click="updateDrinkById()"
      >
        {{ $t('drinks.update') }}
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
