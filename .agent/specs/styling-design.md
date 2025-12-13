# スタイリング・テーマ仕様

## テーマ方針
- Bulma v1 のテーマクラス `theme-light` / `theme-dark` を `<html>` に付与し、CSS 変数を継承させる。
- 初回訪問時は OS の `prefers-color-scheme` を採用する。

## 優先順位・解決順
- localStorage キー: `theme-preference`。
- 許容値: `theme-system` / `theme-light` / `theme-dark`。
- 解決順序: 保存済みの設定があればそれを採用、なければ OS 設定にフォールバック。
- `theme-system` 選択時は、OS 設定変化（`matchMedia('(prefers-color-scheme: dark)')`）に即時追従。
- 解決後のテーマクラス（`theme-light` / `theme-dark`）を `useHead` で `<html>` にバインド。

## UI コントロール
- ヘッダーのトグルは `system → light → dark` の順に循環。
- ツールチップ/ARIA 用ラベルは i18n `theme.system` / `theme.light` / `theme.dark` を使用。
- アイコン状態: monitor(システム), sun(ライト), moon(ダーク)。色も状態に合わせる。
- 循環操作で再び `theme-system` を選べる。

## アクセシビリティ
- ローカライズ済みラベルを用いた `<button>` で `aria-label` / `title` を付与。

## 実装箇所
- 状態保持と永続化: `app/layouts/custom.vue`。
- トグル UI: `app/components/domain/header/atoms/ThemeButton.vue`。
