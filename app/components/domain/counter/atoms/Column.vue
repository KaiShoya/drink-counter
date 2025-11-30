<spec lang="md">
飲み物カウンターの1列（1つの飲み物ラベル）を表示するコンポーネント。
飲み物の種類を選択するピッカーと、現在の杯数を表示する。

## Props
- labelId: number - ラベルID
- labelName: string - ラベル名
- currentDrink: NumberOfDrink | null - 現在選択されている飲み物
- drinks: Array<NumberOfDrink> - 選択可能な飲み物のリスト
- count: number - 現在の杯数
- color: string - ラベルの色
- updateDefaultDrink: (labelId: number, drinkId: number) -> Promise<void> | void - デフォルトの飲み物を更新する関数

## Features
- BaseDrumRollPickerPopupを使用して飲み物の種類を変更できる
- 飲み物が変更されると updateDefaultDrink を呼び出す
- 飲み物リストが空の場合や更新中はピッカーが無効化される
</spec>

<script setup lang="ts">
import { LOCALE_DRINKS_SELECT } from '~/utils/locales'

const { t } = useI18n()

const props = defineProps<{
  labelId: number
  labelName: string
  currentDrink: NumberOfDrink | null
  drinks: Array<NumberOfDrink>
  count: number
  color: string
  updateDefaultDrink: (labelId: number, drinkId: number) => Promise<void> | void
}>()

const isUpdating = ref(false)

const drumRollItems = computed(() => props.drinks.map(drink => ({
  id: drink.id,
  label: `${props.labelName} : ${drink.name}`
})))

const hasDrinks = computed(() => drumRollItems.value.length > 0)

const setSelectedDrink = async (drinkId: number | string) => {
  if (typeof drinkId !== 'number') {
    return
  }

  if (drinkId === props.currentDrink?.id) {
    return
  }

  isUpdating.value = true
  try {
    await props.updateDefaultDrink(props.labelId, drinkId)
  } catch (error) {
    logger.error('Failed to update default drink', undefined, error)
  } finally {
    isUpdating.value = false
  }
}
</script>

<template>
  <div class="columns is-gapless is-multiline is-mobile is-vcentered m-auto">
    <div
      class="ml-1"
      :style="{ padding: '5px', height: '38px', backgroundColor: color }"
    />

    <div class="column control subtitle ml-2 mr-4 column-picker">
      <!-- SP: Drum Roll Picker -->
      <div class="is-hidden-desktop">
        <BaseMoleculesDrumRollPickerPopup
          :model-value="currentDrink?.id ?? null"
          :items="drumRollItems"
          :placeholder="t(LOCALE_DRINKS_SELECT)"
          :disabled="!hasDrinks || isUpdating"
          @update:model-value="setSelectedDrink"
        />
      </div>

      <!-- PC: Dropdown -->
      <div class="select is-fullwidth is-hidden-touch">
        <select
          :value="currentDrink?.id ?? ''"
          :disabled="!hasDrinks || isUpdating"
          @change="(e) => setSelectedDrink(Number((e.target as HTMLSelectElement).value))"
        >
          <option
            value=""
            disabled
            selected
            style="display:none;"
          >
            {{ t(LOCALE_DRINKS_SELECT) }}
          </option>
          <option
            v-for="item in drumRollItems"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            :selected="item.id === currentDrink?.id"
          />
        </select>
      </div>
    </div>

    <div class="column has-text-right is-25px mr-1">
      <span class="subtitle">{{ count }}</span>
    </div>
  </div>
</template>

<style scoped></style>
