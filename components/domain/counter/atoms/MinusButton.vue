<script setup lang="ts">
defineProps<{
  clickFunction: Function,
}>()
</script>

<template>
  <BaseAtomsButton
    label="minus"
    :click-function="clickFunction"
  >
    <Icon name="mdi:minus" />
  </BaseAtomsButton>
</template>
