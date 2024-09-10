<script setup lang="ts">
defineProps<{
  clickFunction: Function,
}>()
</script>

<template>
  <button
    class="column is-2 button is-button-large"
    aria-label="plus"
    @click="clickFunction()"
  >
    <Icon name="mdi:plus" />
  </button>
</template>
