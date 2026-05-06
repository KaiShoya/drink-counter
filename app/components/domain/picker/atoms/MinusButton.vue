<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <button
    class="is-2 button radius-right-unset"
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
  font-size: 1.25rem;
}
</style>
