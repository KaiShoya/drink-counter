<script setup lang="ts">
const props = withDefaults(defineProps<{
  mode?: 'app' | 'page',
  zIndex?: number | null,
}>(), {
  mode: 'app',
  zIndex: null,
})

const computedZIndex = () => {
  if (props.zIndex) {
    return props.zIndex
  } else if (props.mode === 'app') {
    return 1000
  } else if (props.mode === 'page') {
    return 29
  }
  return 1000
}
</script>

<template>
  <div class="loader-wrapper">
    <div class="loader is-loading" />
  </div>
</template>

<style scoped>
.loader-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #474747;
  opacity: 0.4;
  z-index: v-bind('computedZIndex()');
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    height: 30px;
    width: 30px;
  }
}
</style>
