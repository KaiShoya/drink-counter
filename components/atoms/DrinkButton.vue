<script setup lang="ts">
const props = defineProps<{
  id: Number,
  name: string,
  drink_id: Number,
  count: Number,
  increment: Function,
  decrement: Function,
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile">
    <button
      class="column is-2 button"
      @click="decrement(drink_id, id)"
    >
      <i class="mdi mdi-minus"></i>
    </button>

    <div class="column subtitle ml-5">{{ name }}</div>

    <div class="column is-1"><span class="subtitle">{{ count }}</span></div>
    <button
      class="column is-2 button"
      @click="increment(drink_id, id)"
    >
    <i class="mdi mdi-plus"></i>
  </button>
</div>
</template>
