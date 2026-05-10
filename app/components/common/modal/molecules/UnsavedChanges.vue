<script setup lang="ts">
import {
  LOCALE_MODAL_SAVE_AND_LEAVE,
  LOCALE_MODAL_DISCARD_AND_LEAVE,
  LOCALE_MODAL_STAY,
} from '~/utils/locales'

const { t } = useI18n()

withDefaults(defineProps<{
  title: string
  content: string
  discard: () => void
  cancel: () => void
  save?: () => void | Promise<void>
  showSave?: boolean
  isSaving?: boolean
}>(), {
  save: undefined,
  showSave: false,
  isSaving: false,
})
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
          v-if="showSave"
          class="button is-success"
          :class="{ 'is-loading': isSaving }"
          :disabled="isSaving"
          @click="save?.()"
        >
          {{ t(LOCALE_MODAL_SAVE_AND_LEAVE) }}
        </button>
        <button
          class="button is-danger"
          @click="discard()"
        >
          {{ t(LOCALE_MODAL_DISCARD_AND_LEAVE) }}
        </button>
        <button
          class="button"
          @click="cancel()"
        >
          {{ t(LOCALE_MODAL_STAY) }}
        </button>
      </footer>
    </div>
  </div>
</template>