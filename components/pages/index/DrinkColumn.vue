<script setup lang="ts">
defineProps<{
  drinkId: Number,
  name: string,
  count: Number,
  color: string,
  drinkCounterId: Number,
  increment: Function,
  decrement: Function,
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile is-vcentered">
    <button
      class="column is-2 button"
      @click="decrement(drinkId, drinkCounterId)"
    >
      <i class="mdi mdi-minus" />
    </button>

    <div
      class="ml-1"
      :style="{ padding: '5px', height: '38px', backgroundColor: color }"
    />

    <div class="column subtitle ml-2">
      {{ name }}
    </div>

    <div class="column is-1">
      <span class="subtitle">{{ count }}</span>
    </div>
    <button
      class="column is-2 button"
      @click="increment(drinkId, drinkCounterId)"
    >
      <i class="mdi mdi-plus" />
    </button>
  </div>
</template>

<style scoped></style>
