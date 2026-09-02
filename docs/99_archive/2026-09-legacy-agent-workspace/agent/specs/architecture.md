# アーキテクチャ仕様

**最終更新**: 2025-12-10  
**ステータス**: Living Document

## 概要

Drink Counter は、日々のアルコール摂取量を記録するための Nuxt 4 ベースの Web アプリケーションです。**Clean Architecture** の原則と **BCD Design**（Boundary-Control-Data）パターンに従っています。

## 技術スタック

### コアフレームワーク
- **Nuxt 4 (RC)**: Auto-import 機能を持つ Vue.js メタフレームワーク
- **Vue 3**: Composition API
- **TypeScript**: Strict モード有効

### 状態管理・データ層
- **Pinia**: グローバル状態管理
- **Supabase**: Backend-as-a-Service（PostgreSQL + Auth + RLS）
- **Repository Pattern**: データアクセス抽象化

### UI・スタイリング
- **Bulma**: CSS フレームワーク
- **Animate.css**: アニメーションライブラリ
- **SCSS**: カスタムスタイリング
- **@nuxt/icon** + **@iconify-json/mdi**: アイコン管理

### 国際化・アナリティクス
- **@nuxtjs/i18n**: 多言語サポート（ja, en）
- **nuxt-gtag**: Google Analytics 連携

## ディレクトリ構造

```
app/
├── assets/scss/              # Global SCSS (minimal usage)
├── components/               # Vue components
│   ├── base/                # Base UI components
│   ├── common/              # Shared components
│   └── domain/              # Domain-specific components
├── layouts/                 # Layout templates
├── middleware/              # Route middleware (auth, etc.)
├── pages/                   # Route pages (no error handling here)
├── plugins/                 # Nuxt plugins
│   ├── error.client.ts     # Global error handler
│   └── repositories.ts     # DI for repositories
├── repositories/        # Data access repositories
├── types/                   # TypeScript types
│   └── database.types.ts   # Supabase-generated types
└── utils/                   # Utilities and constants
    ├── api/                # (Deprecated)
    ├── domain/             # Domain logic
    ├── logging/            # Logger utilities
    ├── common.ts           # Common utilities
    ├── constant.ts         # Constants
    ├── customError.ts      # Custom error classes
    ├── locales.ts          # i18n key constants
    └── toast.ts            # Toast notification utilities

store/                      # Pinia store modules
├── app/                    # App-level state (loading, etc.)
├── data/                   # Data layer (mirrors Supabase models)
│   ├── drinkLabels/       # Drink labels CRUD
│   ├── drinks/            # Drinks CRUD
│   └── drinkCounters/     # (planned)
├── pages/                  # Page-specific aggregated state
│   ├── index/             # Index page state
│   ├── data/              # Data view state
│   ├── drinks/            # Drinks management state
│   ├── labels/            # Labels management state
│   └── settings/          # Settings page state
├── supabase/              # Supabase auth actions
└── user/                  # User session state

supabase/
├── config.toml            # Supabase local config
├── seed.sql               # Seed data
├── migrations/            # Database migrations
└── functions/             # Edge functions (if any)
```

## 各層の責務

### 1. Pages 層（`app/pages/`）
- **責務**: ルート定義とページ構成
- **ルール**:
  - 直接的なエラーハンドリングはしない（plugins/middleware で処理）
  - `store/pages/` のページ専用 Pinia ストアを使用
  - 認証・ガード用のミドルウェアを適用
  - ロジックは最小限に—ストアに委譲

### 2. Store 層（`store/`）
- **責務**: 状態管理とビジネスロジックのオーケストレーション

#### `store/data/` - データ層
- Supabase テーブルモデルをミラーリング
- リポジトリと直接やり取り
- エラーメッセージ**コード**を返す（トーストメッセージは表示しない）
- 純粋なデータ操作（CRUD）

#### `store/pages/` - プレゼンテーション層
- 複数のデータストアを組み合わせ
- ページ固有の集約された状態
- エラー時に**トーストメッセージを表示**
- 実際のデータ操作は `store/data/` に委譲

#### `store/user/` - ユーザーセッション
- ログイン状態（`isLogin`, `userName`, `userAvatarUrl`）
- ユーザー設定（`userSetting`）
- タイムゾーン/締め時間に基づく日付計算

#### `store/supabase/` - 認証アクション
- サインイン/サインアップ/サインアウト
- OAuth 連携（Google）

### 3. Repository 層（`app/repositories/`）
- **責務**: データアクセスの抽象化
- **パターン**: リポジトリインターフェースを返すファクトリ関数
- **エラーハンドリング**: カスタムエラー（`SupabaseResponseError`）をスロー
- **型安全性**: 生成された `Database` 型を使用

**リポジトリ**:
- `drinkCountersRepository`: 飲酒カウンターの CRUD と集計
- `drinksRepository`: 飲み物マスターの CRUD
- `drinkLabelsRepository`: 飲み物ラベルマスターの CRUD
- `userSettingsRepository`: ユーザー設定の CRUD

### 4. Components 層（`app/components/`）
- **責務**: 再利用可能な UI コンポーネント
- **ルール**:
  - Props 駆動と emit ベースの通信
  - Supabase への直接呼び出しは禁止
  - `storeToRefs` 経由で Pinia ストアを使用
  - コンポーネントレベルの仕様はカスタム `<spec>` ブロックで管理

### 5. Utils 層（`app/utils/`）
- **責務**: 純粋関数と定数
- **モジュール**:
  - `api/`: リポジトリ実装
  - `domain/`: ドメイン固有のユーティリティ
  - `logging/`: ロガー（ログレベル、トランスポートをサポート）
  - `locales.ts`: i18n キー定数（マジックストリングを避ける）
  - `customError.ts`: カスタムエラークラス
  - `toast.ts`: トーストユーティリティ

## データフロー

```
User Action
    ↓
Component (emits event)
    ↓
Page (calls store action)
    ↓
Store (pages/) - Orchestration
    ↓
Store (data/) - Data operations
    ↓
Repository - Supabase API
    ↓
Supabase (PostgreSQL + RLS)
```

## 主要な設計パターン

### 1. Repository Pattern
- インターフェースでデータアクセスを抽象化
- `plugins/repositories.ts` 経由で Dependency Injection
- Factory 関数でリポジトリインスタンスを生成

```ts
export interface DrinksRepository {
  fetchAll(): Promise<DrinkRow[]>
  fetchById(id: number): Promise<DrinkRow | null>
  // ...
}

export const createDrinksRepository = (
  client: SupabaseClient<Database>
): DrinksRepository => {
  // implementation
}
```

### 2. Dependency Injection
- Nuxt plugin 経由で Repository を提供
- `useNuxtApp().$<repositoryName>` でアクセス可能

### 3. エラーハンドリング戦略
- **グローバル**: `app/plugins/error.client.ts` で全エラーをキャッチ
- **カスタムエラー**: `CustomError`, `SupabaseResponseError` 等
- **i18n エラーメッセージ**: locale key を使用
- **Toast 表示**: トースト通知でエラー表示

### 4. 状態管理パターン
- **Data stores**: エラーコードを返す
- **Page stores**: トーストメッセージを表示
- **Composables**: 軽量で非グローバルな状態用

## 認証・認可

### 認証フロー
1. ユーザーが email/password または Google OAuth でサインイン
2. Supabase がセッション管理を担当
3. `useSupabaseUser()` が claims（JWT payload）を提供
4. `store/user/actions.ts` がログイン状態を更新

### 認可
- **Row-Level Security (RLS)** がデータベースレベルで強制
- ポリシー: `user_update_drink_counters` 等
- 全テーブルが `auth.uid()` でフィルタリング

### Middleware
- `app/middleware/auth.ts`: 保護されたルート前にログイン状態をチェック
- 未認証の場合は `/login` にリダイレクト

## タイムゾーン・日付処理

### ユーザー設定
- `timezone`: IANA timezone（例: `Asia/Tokyo`）
- `switching_timing`: 日付切り替え時刻（0-23）

### 日付計算ロジック
- 締め時刻前の記録は**前日**扱い
- 例: 締め時刻=5時の場合、AM 3時の記録 → 前日としてカウント
- 計算処理: `store/user/getters.ts::calcDate()`

## 国際化 (i18n)

### 戦略
- **Locale Key のみ使用**: コンポーネントにハードコードされた文字列は禁止
- **定数**: 全キーを `app/utils/locales.ts` で定義
- **デフォルト Locale**: `ja`（日本語）
- **サポート Locale**: `ja`, `en`

### Locale Key 命名規約
```ts
export const LOCALE_<MODULE>_<FEATURE> = '<module>.<feature>' as const
```

Example:
```ts
export const LOCALE_ROUTES_SETTINGS = 'routes.settings' as const
```

## テスト戦略

### テストフレームワーク
- **Vitest**: ユニットテストと統合テスト
- **@nuxt/test-utils**: Nuxt 固有のテストユーティリティ
- **@pinia/testing**: Pinia ストアテスト

### テストカバレッジ
- Repository 層: Supabase client を Mock
- Store actions: エラーハンドリングと状態変更をテスト
- Utilities: 純粋関数テスト
- Components: Props, emits, computed properties をテスト

### テストファイル配置
- ソースと同じ場所: `*.spec.ts` / `*.test.ts`

## ロギング

### Logger 設定
- **実装**: `app/utils/logging/Logger.ts`
- **Transports**: Console（デフォルト）
- **Log Levels**: `debug`, `info`, `warn`, `error`
- **設定**: `runtimeConfig.public.logLevel` 経由

### 使用例
```ts
import { logger } from '~/utils/logging'

logger.error('Failed to fetch data', { module: 'myModule' }, error)
```

## ビルド・デプロイ

### 開発環境
```bash
pnpm dev  # http://localhost:3001
```

### 本番環境
- **プラットフォーム**: Vercel
- **環境変数**: `.env`（コミット禁止）
- **Supabase**: Managed instance

### バージョニング
- Semantic versioning: `pnpm version <major|minor|patch>`
- Conventional Commits 標準に準拠

## セキュリティ考慰事項

### 環境変数
- `.env` をコミットしない
- `.env.template` をリファレンスとして使用

### Row-Level Security (RLS)
- 全テーブルに RLS ポリシーあり
- ユーザーデータは `auth.uid()` で分離

## 今後の検討事項

- **コンポーネント仕様**: カスタム `<spec>` ブロックで管理（`.agent/specs/` には含めない）
- **API エンドポイント仕様**: バックエンド API 導入時に追加予定
- **パフォーマンス監視**: Sentry 等の導入検討
- **E2E テスト**: 重要なユーザーフロー向けに Playwright/Cypress 検討

---

**関連ファイル**:
- データベーススキーマ: `docs/db/index.md`
- 月次ビュー仕様: `docs/specs/monthly-view.md`
- TypeScript 設定: `tsconfig.json`
- Nuxt 設定: `nuxt.config.ts`
