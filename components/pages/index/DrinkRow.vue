<script setup lang="ts">
import type { DrinkLabelWithDrinks } from '~/store/types/numberOfDrink'

defineProps<{
  label: DrinkLabelWithDrinks,
  increment: Function,
  decrement: Function,
  updateDefaultDrink: Function,
}>()
</script>

<template>
  <div>
    <template v-if="label.currentDrink">
      <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-0">
        <AtomsMinusButton :click-function="() => decrement(label.currentDrink.id, label.currentDrink.drinkCounterId)" />

        <MoleculesDrinkColumn
          class="column mb-0"
          :label-id="label.id"
          :label-name="label.name"
          :drinks="label.drinks"
          :count="label.currentDrink.count ?? 0"
          :color="label.color || label.default_color"
          :current-drink="label.currentDrink"
          :update-default-drink
        />

        <AtomsPlusButton :click-function="() => increment(label.currentDrink.id, label.currentDrink.drinkCounterId)" />
      </div>

      <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-1 p-0">
        <div class="column is-2" />
        <details class="column">
          <summary>詳細</summary>
          <MoleculesDrinkColumnSub
            v-for="drink in label.drinks"
            :key="drink.id"
            :name="drink.name"
            :count="drink.count"
            :color="drink.color"
          />
        </details>
        <div class="column is-2" />
      </div>
    </template>

    <template v-else>
      <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-24">
        <AtomsMinusButton
          :click-function="() => { }"
          :disabled="!label.currentDrink"
        />

        <MoleculesDrinkColumnDisabled
          class="column"
          :name="label.name"
          :count="0"
          :color="label.color || label.default_color"
        />

        <AtomsPlusButton
          :click-function="() => { }"
          :disabled="!label.currentDrink"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.mb-24 {
  margin-bottom: 24px !important;
}
</style>
