<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    class="column is-2 button is-large radius-left-unset"
    @click="clickFunction()"
  >
    &gt;
  </button>
</template>

<style scoped>
.button {
  border-left: none;
}
</style>
