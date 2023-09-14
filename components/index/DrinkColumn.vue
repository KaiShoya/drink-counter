<script setup lang="ts">
defineProps<{
  drinkId: Number,
  name: string,
  count: Number,
  drinkCounterId: Number,
  increment: Function,
  decrement: Function,
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile">
    <button
      class="column is-2 button"
      @click="decrement(drinkId, drinkCounterId)"
    >
      <i class="mdi mdi-minus" />
    </button>

    <div class="column subtitle ml-5">
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
