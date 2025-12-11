<spec lang="md">
iOSのドラムロール風のUIを提供するコンポーネント。
CSS Scroll Snapを利用して、ネイティブライクなスクロール体験を実現している。

## Props
- items: { id: number | string, label: string }[] - 選択肢のリスト
- selectedId: number | string | null - 現在選択されているID
- itemHeight: number - 各項目の高さ（デフォルト: 44px）
- id: string - ルート要素のID
- testId: string - テスト用ID

## Events
- select: (id: number | string) -> void - 項目が選択（スクロール停止またはクリック）されたときに発火
- tap: (id: number | string) -> void - 項目が直接タップされたときに発火（スクロールによる選択では発火しない）

## Features
- スクロール終了時に最も近い項目にスナップし、selectイベントを発火する
- 項目をタップした時はselectとtapの両方のイベントを発火する
- タップ時は視覚的フィードバックとして、アイテムがパルスアニメーションで拡大する
- selectedIdが変更された場合、自動的にその位置までスクロールする
- 横スクロールは無効化されている
</spec>

<script setup lang="ts">
interface Item {
  id: number | string
  label: string
}

const props = withDefaults(defineProps<{
  items: Item[]
  selectedId: number | string | null
  itemHeight?: number
  id?: string
  testId?: string
}>(), {
  itemHeight: 44,
  id: undefined,
  testId: undefined,
})

const emit = defineEmits<{
  (e: 'select', id: number | string): void
  (e: 'tap', id: number | string): void
}>()

const scroller = ref<HTMLElement | null>(null)
const isScrolling = ref(false)
const tappedItemId = ref<number | string | null>(null)

// アニメーション時間を定数として定義（CSS の animation duration と一致させる）
const TAP_ANIMATION_DURATION = 400

// 初期スクロール位置の設定
onMounted(() => {
  nextTick(() => {
    scrollToSelected(false)
  })
})

// selectedId が変わったらスクロール
watch(() => props.selectedId, (newVal, oldVal) => {
  if (newVal !== oldVal && !isScrolling.value) {
    scrollToSelected(true)
  }
})

const scrollToSelected = (smooth: boolean) => {
  if (!scroller.value || props.selectedId === null) return

  const index = props.items.findIndex(item => item.id === props.selectedId)
  if (index === -1) return

  scroller.value.scrollTo({
    top: index * props.itemHeight,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

// スクロール終了時の処理（スナップされた項目を選択）
let scrollTimeout: NodeJS.Timeout | null = null

const onScroll = () => {
  isScrolling.value = true
  if (scrollTimeout) clearTimeout(scrollTimeout)

  scrollTimeout = setTimeout(() => {
    if (!scroller.value) return

    const scrollTop = scroller.value.scrollTop
    const index = Math.round(scrollTop / props.itemHeight)
    const item = props.items[index]

    if (item && item.id !== props.selectedId) {
      emit('select', item.id)
    }
    isScrolling.value = false
  }, 100) // スクロール終了判定のデバウンス時間
}

const onItemClick = (id: number | string) => {
  // タップ時のアニメーションフィードバックを設定
  tappedItemId.value = id
  setTimeout(() => {
    tappedItemId.value = null
  }, TAP_ANIMATION_DURATION)
  
  emit('select', id)
  emit('tap', id)
  // 親コンポーネントが selectedId を更新すると watch が発火し、通常のスクロールが実行される
}
</script>

<template>
  <div
    :id="id"
    class="drum-roll-picker"
    :data-testid="testId"
  >
    <div
      ref="scroller"
      class="drum-roll-scroller"
      @scroll="onScroll"
      :style="{ height: `${itemHeight * 5}px` }"
    >
      <!-- 上部のスペーサー（中央に配置するため） -->
      <div
        :style="{ height: `${itemHeight * 2}px` }"
        class="spacer"
        aria-hidden="true"
      ></div>

      <div
        v-for="item in items"
        :key="item.id"
        class="drum-roll-item"
        :class="{ 
          'is-selected': item.id === selectedId,
          'is-tapped': item.id === tappedItemId
        }"
        :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }"
        @click="onItemClick(item.id)"
        role="option"
        :aria-selected="item.id === selectedId"
      >
        {{ item.label }}
      </div>

      <!-- 下部のスペーサー -->
      <div
        :style="{ height: `${itemHeight * 2}px` }"
        class="spacer"
        aria-hidden="true"
      ></div>
    </div>

    <!-- 選択範囲のハイライト -->
    <div
      class="selection-highlight"
      :style="{
        height: `${itemHeight}px`,
        top: `${itemHeight * 2}px`
      }"
      aria-hidden="true"
    >
    </div>
  </div>
</template>

<style scoped>
.drum-roll-picker {
  position: relative;
  overflow: hidden;
  background: transparent;
  user-select: none;
  width: 100%;
}

.drum-roll-scroller {
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  /* Firefox */
  scrollbar-width: none;
  /* IE/Edge */
  -ms-overflow-style: none;
  position: relative;
  z-index: 2;
}

.drum-roll-scroller::-webkit-scrollbar {
  display: none;
}

.drum-roll-item {
  text-align: center;
  scroll-snap-align: center;
  cursor: pointer;
  color: var(--bulma-text-weak);
  transition: color 0.2s, transform 0.2s, opacity 0.2s;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px;
  opacity: 0.6;
}

.drum-roll-item.is-tapped {
  animation: tap-pulse 0.4s ease-out;
}

@keyframes tap-pulse {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.drum-roll-item.is-selected {
  color: var(--bulma-text-strong);
  font-weight: 700;
  transform: scale(1.05);
  opacity: 1;
}

.selection-highlight {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
  border-top: 1px solid var(--bulma-border-weak);
  border-bottom: 1px solid var(--bulma-border-weak);
  background: var(--bulma-background-hover);
  z-index: 1;
}
</style>
