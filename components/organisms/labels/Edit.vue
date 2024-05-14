<script setup lang="ts">
const localePath = useLocalePath()

defineProps<{
  saveFunction: Function,
  save: typeof LOCALE_DRINKS_UPDATE | typeof LOCALE_DRINKS_ADD,
}>()
const name = defineModel<string | null>('name')
const color = defineModel<string | null>('color')
const standardAmount = defineModel<number>('standardAmount')
</script>

<template>
  <div>
    <div class="field">
      <label class="label">{{ $t(LOCALE_DRINKS_NAME) }}</label>
      <div class="control">
        <input
          v-model="name"
          class="input"
          type="text"
          :placeholder="$t(LOCALE_LABELS_NAME_PLACEHOLDER)"
        >
      </div>
    </div>

    <div class="field">
      <label class="label">{{ $t(LOCALE_DRINKS_COLOR) }}</label>
      <div class="control columns is-vcentered is-mobile">
        <div
          class="column"
          style="flex: none; margin-left: 12px;"
        >
          <input
            v-model="color"
            type="color"
          >
        </div>
        <input
          v-model="color"
          class="input column"
          type="text"
          placeholder="#000000"
        >
        <div
          class="column"
          style="flex: none; margin-right: 12px;"
        >
          <button
            class="button"
            @click="color = generateRandomColor()"
          >
            <span class="icon is-medium">
              <i class="mdi mdi-cached mdi-24px" />
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">{{ $t(LOCALE_LABELS_STANDARD_AMOUNT) }}</label>
      <div class="control">
        <input
          v-model="standardAmount"
          class="input"
          type="number"
          placeholder="1"
        >
      </div>
    </div>

    <div>
      <button
        class="button"
        @click="saveFunction()"
      >
        {{ $t(save) }}
      </button>

      <NuxtLink
        :to="localePath('/labels')"
        class="button"
      >
        {{ $t(LOCALE_DRINKS_CANCEL) }}
      </NuxtLink>
    </div>
  </div>
</template>
