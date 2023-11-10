<script setup lang="ts">
defineProps<{
  title: string,
  content: string,
  success: Function,
  cancel: Function
}>()
</script>

<template>
  <div class="modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          {{ title }}
        </p>
        <button
          class="delete"
          aria-label="close"
        />
      </header>
      <section class="modal-card-body">
        {{ content }}
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-success"
          @click="success()"
        >
          {{ $t('modal.yes') }}
        </button>
        <button
          class="button"
          @click="cancel()"
        >
          {{ $t('modal.no') }}
        </button>
      </footer>
    </div>
  </div>
</template>
