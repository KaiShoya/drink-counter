<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    aria-label="today"
    class="button radius-unset"
    @click="clickFunction()"
  >
    <Icon
      name="mdi:calendar-today"
      class="icon"
    />
  </button>
</template>

<style scoped>
.button {
  border-right: none;
  flex: none;
  width: 50px;
  height: 62px;
}
</style>
