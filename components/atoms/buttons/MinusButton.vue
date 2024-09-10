<script setup lang="ts">
defineProps<{
  clickFunction: Function,
}>()
</script>

<template>
  <button
    class="column is-2 button is-button-large"
    aria-label="minus"
    @click="clickFunction()"
  >
    <Icon name="mdi:minus" />
  </button>
</template>
