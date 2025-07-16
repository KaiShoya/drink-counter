<script setup lang="ts">
defineProps<{
  clickFunction: () => void
}>()
</script>

<template>
  <BaseAtomsButton
    label="minus"
    :click-function="clickFunction"
  >
    <Icon
      name="mdi:minus"
      class="icon"
    />
  </BaseAtomsButton>
</template>
