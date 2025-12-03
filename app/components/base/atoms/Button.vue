<script setup lang="ts">
defineProps<{
  label: string
  clickFunction: () => void
}>()
</script>

<template>
  <button
    class="column is-2 button is-button-large is-justify-content-center is-align-items-center"
    :aria-label="label"
    @click="clickFunction()"
  >
    <slot />
  </button>
</template>
