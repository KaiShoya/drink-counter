<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    aria-label="today"
    class="column is-50px button radius-unset"
    @click="clickFunction()"
  >
    <Icon name="mdi:calendar-today" />
  </button>
</template>

<style scoped>
.button {
  border-right: none;
}

.is-50px {
  flex: none;
  width: 50px;
}
</style>
