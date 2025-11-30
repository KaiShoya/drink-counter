<spec lang="md">
DrumRollPickerをポップアップ表示するためのラッパーコンポーネント。
トリガーボタンをクリックするとピッカーが表示され、外部クリックで閉じる機能を持つ。

## Props
- items: { id: number | string, label: string }[] - 選択肢のリスト
- modelValue: number | string | null - 現在選択されているID（v-model対応）
- placeholder: string - 未選択時に表示するテキスト（デフォルト: 'Select'）
- disabled: boolean - 無効化フラグ

## Events
- update:modelValue: (id: number | string) -> void - 値が変更されたときに発火

## Features
- トリガーボタンには現在の選択項目のラベルが表示される
- ポップアップはフェード＆スケールアニメーションで表示される
- 外部クリック（document click）と他のピッカーの開閉を検知してポップアップを閉じる
</spec>

<script setup lang="ts">
interface Item {
  id: number | string
  label: string
}

const props = withDefaults(defineProps<{
  items: Item[]
  modelValue: number | string | null
  placeholder?: string
  disabled?: boolean
}>(), {
  placeholder: 'Select',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', id: number | string): void
}>()

const isPickerOpen = ref(false)
const pickerContainer = ref<HTMLElement | null>(null)
const uid = Math.random().toString(36).substring(2)

const selectedLabel = computed(() => {
  const item = props.items.find(i => i.id === props.modelValue)
  return item ? item.label : props.placeholder
})

const togglePicker = () => {
  if (props.disabled) return
  
  if (!isPickerOpen.value) {
    // Close other pickers before opening this one
    document.dispatchEvent(new CustomEvent('drum-roll-picker:open', { detail: { uid } }))
    isPickerOpen.value = true
  } else {
    isPickerOpen.value = false
  }
}

const closePicker = () => {
  isPickerOpen.value = false
}

const onSelect = (id: number | string) => {
  emit('update:modelValue', id)
}

const handleClickOutside = (event: MouseEvent) => {
  if (isPickerOpen.value && pickerContainer.value && !pickerContainer.value.contains(event.target as Node)) {
    closePicker()
  }
}

const handleOtherPickerOpen = (event: Event) => {
  const customEvent = event as CustomEvent
  if (customEvent.detail && customEvent.detail.uid !== uid) {
    closePicker()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('drum-roll-picker:open', handleOtherPickerOpen)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('drum-roll-picker:open', handleOtherPickerOpen)
})
</script>

<template>
  <div
    class="drum-roll-picker-popup"
    ref="pickerContainer"
  >
    <button
      class="picker-trigger"
      type="button"
      :disabled="disabled"
      :aria-expanded="isPickerOpen"
      @click.stop="togglePicker"
    >
      <span class="picker-trigger__label">{{ selectedLabel }}</span>
      <span
        class="picker-trigger__chevron"
        :class="{ 'is-open': isPickerOpen }"
      >
        <Icon
          name="mdi:chevron-down"
          size="20"
        />
      </span>
    </button>

    <transition name="fade-scale">
      <div
        v-if="isPickerOpen"
        class="picker-popover"
      >
        <BaseAtomsDrumRollPicker
          :items="items"
          :selected-id="modelValue"
          @select="onSelect"
        />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.drum-roll-picker-popup {
  position: relative;
}

.picker-trigger {
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--bulma-border);
  background: var(--bulma-scheme-main);
  min-height: 40px;
  padding: 0 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  color: var(--bulma-text);
  transition: box-shadow 160ms ease, border-color 160ms ease;
  cursor: pointer;
}

.picker-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.picker-trigger:focus-visible {
  outline: none;
  border-color: var(--bulma-link);
  box-shadow: 0 0 0 3px rgba(92, 135, 248, 0.2);
}

.picker-trigger__label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.picker-trigger__chevron {
  display: flex;
  align-items: center;
  transition: transform 160ms ease;
}

.picker-trigger__chevron.is-open {
  transform: rotate(180deg);
}

.picker-popover {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 10;
  padding: 12px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--bulma-scheme-main) 96%, transparent);
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

.theme-dark .drum-roll-picker-popup .picker-popover {
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
