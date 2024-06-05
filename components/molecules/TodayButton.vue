<script setup lang="ts">
defineProps<{
  clickFunction: Function,
}>()
</script>
<template>
  <button
    class="column is-50px button is-large radius-unset"
    @click="clickFunction()"
  >
    <span class="icon is-medium">
      <i class="mdi mdi-calendar-today" />
    </span>
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
