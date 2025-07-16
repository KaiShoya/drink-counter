<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    class="is-2 button is-large radius-right-unset"
    @click="clickFunction()"
  >
    <Icon
      name="mdi:chevron-left"
      class="icon"
    />
  </button>
</template>

<style scoped>
.button {
  border-right: none;
  height: 62px;
}
</style>
