<script setup lang="ts">
defineProps<{
  label: string,
  clickFunction: Function,
}>()
</script>

<template>
  <button
    class="column is-2 button is-button-large"
    :aria-label="label"
    @click="clickFunction()"
  >
    <slot />
  </button>
</template>
