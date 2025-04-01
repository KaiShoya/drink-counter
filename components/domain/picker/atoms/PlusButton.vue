<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    class="is-2 button is-large radius-left-unset"
    @click="clickFunction()"
  >
    <Icon
      name="mdi:chevron-right"
      class="icon"
    />
  </button>
</template>

<style scoped>
.button {
  border-left: none;
  height: 62px;
}
</style>
