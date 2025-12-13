# スタイリング・テーマ仕様

## テーマ方針
- Bulma v1 のテーマクラス `theme-light` / `theme-dark` を `<html>` に付与し、CSS 変数を継承させる。
- 初回訪問時は OS の `prefers-color-scheme` を採用する。

## 優先順位・解決順
- localStorage キー: `theme-preference`。
- 許容値: `theme-light` / `theme-dark`。
- 解決順序: 保存済みの設定があればそれを採用、なければ OS 設定にフォールバック。
- ユーザー選択後はその設定を永続化（再訪時も継続）。

## UI コントロール
- ヘッダーのトグルは light/dark の切り替えのみ。
- ツールチップ/ARIA 用ラベルは i18n `theme.light` / `theme.dark` を使用。
- アイコン状態: sun(ライト), moon(ダーク)。色も状態に合わせる。

## アクセシビリティ
- ローカライズ済みラベルを用いた `<button>` で `aria-label` / `title` を付与。

## 実装箇所
- 状態保持と永続化: `app/layouts/custom.vue`。
- トグル UI: `app/components/domain/header/atoms/ThemeButton.vue`。
