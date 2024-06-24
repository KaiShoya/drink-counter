<script setup lang="ts">
defineProps<{
  close: Function
}>()
</script>

<template>
  <div class="image-modal">
    <button
      class="delete is-large"
      @click="close()"
    />
    <img
      src="/qrcode.svg"
      loading="lazy"
    >
  </div>
</template>

<style scoped>
.image-modal {
  position: absolute;
  top: 0;
  left: 0;
  height: 100svh;
  width: 100%;
  background: #0a0a0adb;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
