<script setup lang="ts">
defineProps<{
  label: DrinkLabelWithDrinks
  increment: (drinkId: number, drinkCounterId: number) => void
  decrement: (drinkId: number, drinkCounterId: number) => void
  updateDefaultDrink: (labelId: number, drinkId: number) => void
}>()
</script>

<template>
  <div>
    <template v-if="label.currentDrink">
      <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-0">
        <DomainCounterAtomsMinusButton
          :click-function="() => decrement(label.currentDrink.id, label.currentDrink.drinkCounterId)"
        />

        <DomainCounterAtomsColumn
          class="column mb-0"
          :label-id="label.id"
          :label-name="label.name"
          :drinks="label.drinks"
          :count="label.currentDrink.count ?? 0"
          :color="label.color || label.default_color"
          :current-drink="label.currentDrink"
          :update-default-drink
        />

        <DomainCounterAtomsPlusButton
          :click-function="() => increment(label.currentDrink.id, label.currentDrink.drinkCounterId)"
        />
      </div>

      <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-1 p-0">
        <div class="column is-2" />
        <details class="column">
          <summary class="detail-link">
            {{ $t(LOCALE_DETAIL) }}
          </summary>
          <DomainCounterAtomsSubColumn
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
        <DomainCounterAtomsMinusButton
          :click-function="() => { }"
          :disabled="!label.currentDrink"
        />

        <DomainCounterAtomsColumnDisabled
          class="column"
          :name="label.name"
          :count="0"
          :color="label.color || label.default_color"
        />

        <DomainCounterAtomsPlusButton
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

.detail-link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
