<script
  setup
  lang="ts"
>
import { storeToRefs } from 'pinia'
import { usePageDrinkLabelEditStore } from '~/store/pages/labels/edit'

const drinkLabelEditStore = usePageDrinkLabelEditStore()
const { name, color, standardAmount } = storeToRefs(drinkLabelEditStore)
const { initPage, update } = drinkLabelEditStore

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
      <label class="label">{{ $t('labels.standard_amount') }}</label>
      <div class="control">
        <input
          v-model="standardAmount"
          class="input"
          type="number"
          placeholder="1"
        >
      </div>
    </div>

    <div>
      <button
        class="button"
        @click="update()"
      >
        {{ $t('drinks.update') }}
      </button>

      <NuxtLink
        to="/labels"
        class="button"
      >
        {{ $t('drinks.cancel') }}
      </NuxtLink>
    </div>
  </div>
</template>
