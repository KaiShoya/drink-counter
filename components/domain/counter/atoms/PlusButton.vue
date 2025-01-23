<script setup lang="ts">
defineProps<{
  clickFunction: Function,
}>()
</script>

<template>
  <BaseAtomsButton
    label="plus"
    :click-function="clickFunction"
  >
    <Icon name="mdi:plus" />
  </BaseAtomsButton>
</template>
