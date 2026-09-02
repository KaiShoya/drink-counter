# アーキテクチャ

ステータス: 現行コード構成を確認済み（2026-09-02）

## 技術構成

- Nuxt 4 / Vue 3 / TypeScript
- Pinia による状態管理
- Supabase による認証とデータアクセス
- `@nuxtjs/i18n` による日本語・英語対応
- Bulma と SCSS による UI スタイル

## レイヤー

- `app/pages/`: ルートと画面の組み立て。
- `app/components/`: 再利用可能な UI とドメイン UI。
- `app/stores/`: UI 状態、データ状態、ユーザー・認証状態を管理。
- `app/repositories/`: Supabase へのデータアクセスを集約。
- `app/utils/`: 日付、ロギング、エラー、ロケールなどの共通処理。
- `supabase/migrations/`: データベース変更履歴。

## 責務の原則

画面・コンポーネントは Repository を直接呼ばず、Store を介して操作する。Repository は Supabase のエラーをアプリケーション用エラーへ変換し、Store は UI 状態、通知、ロギングを担う。新しいデータアクセスや状態管理を追加する場合は、この分離を維持する。

## テーマ

Bulma の `theme-light` / `theme-dark` を HTML 要素に適用する。保存済みの `theme-preference` があれば優先し、なければ OS の `prefers-color-scheme` を使う。

旧仕様の詳細は `99_archive/2026-09-legacy-agent-workspace/agent/specs/architecture.md`、`api-communication.md`、`styling-design.md` に保存している。実装変更時は、現行コードと照合したうえで本書を更新する。
