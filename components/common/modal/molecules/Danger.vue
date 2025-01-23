<script
  setup
  lang="ts"
>
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
          @click="cancel()"
        />
      </header>
      <section class="modal-card-body">
        {{ content }}
      </section>
      <footer class="modal-card-foot">
        <button
          class="button is-danger"
          @click="success()"
        >
          {{ $t(LOCALE_MODAL_YES) }}
        </button>
        <button
          class="button"
          @click="cancel()"
        >
          {{ $t(LOCALE_MODAL_NO) }}
        </button>
      </footer>
    </div>
  </div>
</template>
