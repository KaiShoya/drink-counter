<script setup lang="ts">
defineProps<{
  clickFunction: () => void
  disabled?: boolean
}>()
</script>

<template>
  <BaseAtomsButton
    label="minus"
    :click-function="clickFunction"
    :disabled="disabled"
  >
    <Icon
      name="mdi:minus"
      class="icon"
    />
  </BaseAtomsButton>
</template>
