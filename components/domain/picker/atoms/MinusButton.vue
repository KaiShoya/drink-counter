<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    class="column is-2 button is-large radius-right-unset"
    @click="clickFunction()"
  >
    &lt;
  </button>
</template>

<style scoped>
.button {
  border-right: none;
}
</style>
