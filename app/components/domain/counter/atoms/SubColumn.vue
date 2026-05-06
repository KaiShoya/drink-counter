<script setup lang="ts">
defineProps<{
  name: string
  count: number
  color: string
  increment?: () => void
  decrement?: () => void
  select?: () => void
}>()
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile is-vcentered mb-1 p-0">
    <DomainCounterAtomsMinusButton class="is-medium" :click-function="decrement ?? (() => {})" />

    <div
      class="ml-5"
      :style="{ padding: '5px', height: '14px', backgroundColor: color }"
    />

    <div class="column control subtitle ml-2 clickable" @click="select && select()">
      <span class="subtitle is-6">
        {{ name }}
      </span>
    </div>

    <div class="column is-1">
      <span class="subtitle is-6">
        {{ count }}
      </span>
    </div>

    <DomainCounterAtomsPlusButton :click-function="increment ?? (() => {})" />
  </div>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  user-select: none;
}
</style>
