<script setup lang="ts">
defineProps<{
  label: string
  clickFunction: () => void
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="column is-2 button is-button-large"
    :aria-label="label"
    :disabled="disabled"
    @click="clickFunction()"
  >
    <slot />
  </button>
</template>
