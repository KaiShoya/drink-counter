<script setup lang="ts">
import { LOCALE_DRINKS_AMOUNT, LOCALE_DRINKS_APPLY_STANDARD_AMOUNT, LOCALE_DRINKS_APPLY_STANDARD_AMOUNT_BUTTON, LOCALE_DRINKS_CANCEL, LOCALE_DRINKS_COLOR, LOCALE_DRINKS_COPY_LABEL_COLOR, LOCALE_DRINKS_DRINK_LABEL, LOCALE_DRINKS_NAME, LOCALE_DRINKS_NAME_PLACEHOLDER, LOCALE_DRINKS_RANDOM_COLOR_TITLE, LOCALE_DRINKS_SELECT, LOCALE_DRINKS_STANDARD_AMOUNT, LOCALE_DRINKS_VALIDATION_AMOUNT_INVALID, LOCALE_DRINKS_VALIDATION_COLOR_INVALID, LOCALE_DRINKS_VALIDATION_LABEL_REQUIRED, LOCALE_DRINKS_VALIDATION_NAME_REQUIRED } from '~/utils/locales'
import { generateRandomColor } from '~/utils/common'
import type { DrinkLabelWithDefaultColor } from '~/repositories/drinkLabelsRepository'

const { t } = useI18n()
const localePath = useLocalePath()

const drinkLabelsStore = useDrinkLabelsStore()
const { drinkLabels } = storeToRefs(drinkLabelsStore)
const { findById } = drinkLabelsStore

defineProps<{
  saveFunction: () => void
  save: typeof LOCALE_DRINKS_UPDATE | typeof LOCALE_DRINKS_ADD
  isSaving?: boolean
}>()
const drinkLabelId = defineModel<number | null>('drinkLabelId')
const name = defineModel<string | null>('name')
const color = defineModel<string | null>('color')
const amount = defineModel<number | null>('amount')

const selectedLabel = ref<DrinkLabelWithDefaultColor | null | undefined>(drinkLabelId.value ? findById(drinkLabelId.value) : undefined)

// ラベル変更時に標準量を即時上書きせず、ユーザーに確認を促すために保持する
const pendingStandardAmount = ref<number | null>(null)

const changeDrinkLabelId = (id: number | null) => {
  drinkLabelId.value = id
  pendingStandardAmount.value = null
  if (id) {
    selectedLabel.value = findById(id)
    const std = selectedLabel.value?.standard_amount
    if (std != null) {
      pendingStandardAmount.value = std
    }
  } else {
    selectedLabel.value = null
  }
}

const applyStandardAmount = () => {
  if (pendingStandardAmount.value != null) {
    amount.value = pendingStandardAmount.value
    pendingStandardAmount.value = null
  }
}

const HEX_COLOR_RE = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

// カラーテキスト入力は localColor で管理し、有効な HEX のみ debounce 後に color モデルへ反映する
const localColor = ref<string>(color.value ?? '')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// カラーピッカー側の変更（常に有効値）を localColor に同期する
watch(color, (val) => {
  if (val && val !== localColor.value) {
    localColor.value = val
  }
})

const onLocalColorInput = (val: string) => {
  localColor.value = val
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (HEX_COLOR_RE.test(val)) {
      color.value = val
    }
  }, 300)
}

// 初回保存試行後のみエラーを表示する
const submitted = ref(false)

const errors = computed(() => ({
  name: !name.value?.trim() ? t(LOCALE_DRINKS_VALIDATION_NAME_REQUIRED) : null,
  color: !localColor.value || !HEX_COLOR_RE.test(localColor.value) ? t(LOCALE_DRINKS_VALIDATION_COLOR_INVALID) : null,
  amount: amount.value == null || amount.value < 1 || !Number.isInteger(Number(amount.value)) ? t(LOCALE_DRINKS_VALIDATION_AMOUNT_INVALID) : null,
  drinkLabel: !drinkLabelId.value ? t(LOCALE_DRINKS_VALIDATION_LABEL_REQUIRED) : null,
}))

const hasError = computed(() => Object.values(errors.value).some(v => v !== null))
</script>

<template>
  <div>
    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_DRINK_LABEL) }}</label>
      <div
        class="control columns is-vcentered is-mobile"
        style="margin-left: 12px;"
      >
        <div
          v-if="selectedLabel"
          class="column tag"
          :style="{ flex: 'none', padding: '10px', width: '50px', border: '1px solid', backgroundColor: selectedLabel!.color ?? selectedLabel!.default_color }"
        />
        <div
          v-else
          class="column tag"
          :style="{ flex: 'none', padding: '10px', width: '50px', border: '1px solid' }"
        />
        <div class="column">
          <div
            class="select is-fullwidth"
            :class="{ 'is-danger': submitted && errors.drinkLabel }"
          >
            <select @change="changeDrinkLabelId(Number(($event.target as HTMLInputElement).value))">
              <option
                key=""
                value=""
                :label="t(LOCALE_DRINKS_SELECT)"
                disabled
                :selected="!drinkLabelId"
              />
              <option
                v-for="label in drinkLabels"
                :key="label.id"
                :value="label.id"
                :label="label.name"
                :selected="drinkLabelId === label.id"
              />
            </select>
          </div>
        </div>
      </div>
      <p
        v-if="submitted && errors.drinkLabel"
        class="help is-danger"
      >
        {{ errors.drinkLabel }}
      </p>
    </div>

    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_NAME) }}</label>
      <div class="control">
        <input
          v-model="name"
          class="input"
          :class="{ 'is-danger': submitted && errors.name }"
          type="text"
          :placeholder="t(LOCALE_DRINKS_NAME_PLACEHOLDER)"
        >
      </div>
      <p
        v-if="submitted && errors.name"
        class="help is-danger"
      >
        {{ errors.name }}
      </p>
    </div>

    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_COLOR) }}</label>
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
          :value="localColor"
          class="input column"
          :class="{ 'is-danger': submitted && errors.color }"
          type="text"
          placeholder="#000000"
          @input="onLocalColorInput(($event.target as HTMLInputElement).value)"
        >

        <div
          class="column"
          style="flex: none; margin-right: -12px;"
        >
          <button
            v-if="selectedLabel"
            class="button"
            @click="color = selectedLabel!.color"
          >
            {{ t(LOCALE_DRINKS_COPY_LABEL_COLOR) }}
          </button>
        </div>

        <div
          class="column"
          style="flex: none; margin-right: 12px;"
        >
          <button
            class="button"
            :title="t(LOCALE_DRINKS_RANDOM_COLOR_TITLE)"
            @click="color = generateRandomColor()"
          >
            <Icon
              name="mdi:dice-multiple"
              class="icon"
            />
          </button>
        </div>
      </div>
    </div>

    <div class="field">
      <label class="label">{{ t(LOCALE_DRINKS_AMOUNT) }}</label>
      <p
        v-if="selectedLabel"
        class="help mb-1"
      >
        {{ t(LOCALE_DRINKS_STANDARD_AMOUNT) }} {{ selectedLabel.standard_amount }}
      </p>
      <div class="control">
        <input
          v-model="amount"
          class="input"
          :class="{ 'is-danger': submitted && errors.amount }"
          type="number"
          placeholder="1"
        >
      </div>
      <p
        v-if="submitted && errors.amount"
        class="help is-danger"
      >
        {{ errors.amount }}
      </p>
      <div
        v-if="pendingStandardAmount != null"
        class="mt-2 is-flex is-align-items-center"
        style="gap: 0.5rem;"
      >
        <p class="help">
          {{ t(LOCALE_DRINKS_APPLY_STANDARD_AMOUNT, { amount: pendingStandardAmount }) }}
        </p>
        <button
          class="button is-small is-info is-light"
          @click="applyStandardAmount()"
        >
          {{ t(LOCALE_DRINKS_APPLY_STANDARD_AMOUNT_BUTTON) }}
        </button>
      </div>
    </div>

    <div>
      <button
        class="button mr-2"
        :class="{ 'is-loading': isSaving }"
        :disabled="isSaving"
        @click="submitted = true; !hasError && saveFunction()"
      >
        {{ t(save) }}
      </button>

      <NuxtLink
        :to="localePath('/drinks')"
        class="button"
      >
        {{ t(LOCALE_DRINKS_CANCEL) }}
      </NuxtLink>
    </div>
  </div>
</template>
