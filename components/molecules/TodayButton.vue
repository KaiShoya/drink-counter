<script setup lang="ts">
defineProps<{
  clickFunction: Function,
}>()
</script>
<template>
  <button
    class="column is-50px button is-large ml-2"
    @click="clickFunction()"
  >
    <span class="icon is-medium">
      <i class="mdi mdi-calendar-today" />
    </span>
  </button>
</template>

<style scoped>
.is-50px {
  flex: none;
  width: 50px;
}
</style>
