<script setup lang="ts">
defineProps<{
  labelId: number,
  labelName: string,
  currentDrink: NumberOfDrink | null,
  drinks: Array<NumberOfDrink>,
  count: number,
  color: string,
  updateDefaultDrink: Function,
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile is-vcentered m-auto">
    <div
      class="ml-1"
      :style="{ padding: '5px', height: '38px', backgroundColor: color }"
    />

    <div class="column control subtitle ml-2 mr-4">
      <div class="select is-fullwidth">
        <select @change="updateDefaultDrink(labelId, Number(($event.target as HTMLInputElement).value))">
          <option
            v-for="drink in drinks"
            :key="drink.id"
            :value="drink.id"
            :label="labelName + ' : ' + drink.name"
            :selected="drink.id === currentDrink?.id"
          />
        </select>
      </div>
    </div>

    <div class="column has-text-right is-25px mr-1">
      <span class="subtitle">{{ count }}</span>
    </div>
  </div>
</template>
