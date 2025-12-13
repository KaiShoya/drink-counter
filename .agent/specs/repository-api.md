# リポジトリ API 仕様

**最終更新**: 2025-12-13  
**ステータス**: Living Document  
**関連**: `app/utils/api/`, `app/plugins/repositories.ts`

## 概要

Repository パターンは、データアクセスロジックを抽象化し、アプリケーションと Supabase の間にクリーンなインターフェースを提供します。すべてのリポジトリは Nuxt プラグイン経由で注入され、一貫したエラーハンドリング戦略に従います。

## Repository アーキテクチャ

### Factory パターン
各リポジトリは、Supabase client を受け取る factory 関数で作成されます:

```ts
export const create<Entity>Repository = (
  client: SupabaseClient<Database>
): <Entity>Repository => {
  // implementation
}
```

### Dependency Injection
リポジトリは `app/plugins/repositories.ts` 経由で提供されます:

```ts
export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient<Database>()
  
  return {
    provide: {
      drinkCountersRepository,
      drinksRepository,
      drinkLabelsRepository,
      userSettingsRepository,
    },
  }
})
```

### Store での使用方法
```ts
const { $drinksRepository } = useNuxtApp()
const drinks = await $drinksRepository.fetchAll()
```

## エラーハンドリング

### カスタムエラークラス
```ts
class SupabaseResponseError extends CustomError {
  constructor(
    public readonly originalError: PostgrestError | AuthError,
    messageKey: string,
    params?: Record<string, unknown>
  ) {
    super(messageKey, params)
  }
}
```

### エラー戦略
1. Repository が i18n message key 付きで `SupabaseResponseError` をスロー
2. Data store がキャッチしてエラーコードを返す
3. Page store がキャッチしてトーストメッセージを表示

## Repository インターフェース

---

## 1. DrinksRepository

**ファイル**: `app/utils/api/drinksRepository.ts`  
**テーブル**: `public.drinks`

### Interface

```ts
export interface DrinksRepository {
  fetchAll(): Promise<DrinkRow[]>
  fetchById(id: number): Promise<DrinkRow | null>
  deleteById(drinkId: number, name: string): Promise<void>
  updateById(
    drinkId: number,
    name: string,
    color: string | null,
    amount: number,
    drinkLabelId: number | null
  ): Promise<void>
  updateVisible(drinkId: number, name: string, visible: boolean): Promise<void>
  updateSort(payload: Array<{ id: number; sort: number }>): Promise<void>
  create(
    name: string,
    color: string | null,
    amount: number,
    drinkLabelId: number | null
  ): Promise<DrinkRow>
}

export type DrinkRow = Database['public']['Tables']['drinks']['Row'] & {
  readonly default_color: string
}
```

### メソッド

#### `fetchAll(): Promise<DrinkRow[]>`
**用途**: 現在のユーザーの全飲み物を取得  
**クエリ**: `SELECT * FROM drinks ORDER BY sort, id`  
**RLS**: `auth.uid()` でフィルタ  
**戻り値**: default color 付きの飲み物配列  
**エラー**: `SupabaseResponseError(LOCALE_ERROR_GET_RECORD)` をスロー

**後処理**:
- `color` が NULL の場合に使用するため `default_color` プロパティ（ランダムカラー）を追加

---

#### `fetchById(id: number): Promise<DrinkRow | null>`
**用途**: ID で単一の飲み物を取得  
**クエリ**: `SELECT * FROM drinks WHERE id = $1`  
**戻り値**: 飲み物オブジェクトまたは見つからない場合は NULL  
**エラー**: `SupabaseResponseError(LOCALE_ERROR_GET_RECORD)` をスロー

---

#### `deleteById(drinkId: number, name: string): Promise<void>`
**用途**: 飲み物と関連する drink_counters を削除  
**RPC**: `delete_drink_data(drinkid)`  
**副作用**: `drink_counters` にカスケード  
**エラー**: `SupabaseResponseError(LOCALE_DRINKS_DELETE_FAILURE, { name })` をスロー

**ビジネスロジック**:
- トランザクション削除を保証するため RPC 関数を使用
- 関連する全 drink_counters にカスケード

---

#### `updateById(...): Promise<void>`
**用途**: 飲み物のプロパティを更新  
**クエリ**: `UPDATE drinks SET name, color, amount, drink_label_id WHERE id = $1`  
**エラー**: `SupabaseResponseError(LOCALE_DRINKS_UPDATE_FAILURE, { name })` をスロー

**検証**（アプリケーションレベル）:
- `name`: 空でない文字列
- `amount`: 正の整数（ml）
- `color`: 16進数カラーまたは NULL
- `drinkLabelId`: 有効なラベル ID または NULL

---

#### `updateVisible(...): Promise<void>`
**用途**: 飲み物の表示/非表示を切り替え  
**クエリ**: `UPDATE drinks SET visible WHERE id = $1`  
**エラー**: `SupabaseResponseError(LOCALE_DRINKS_UPDATE_FAILURE, { name })` をスロー

---

#### `updateSort(payload): Promise<void>`
**用途**: ソート順を一括更新  
**RPC**: `bulk_update_drinks_sort(payload)`  
**Payload**: `Array<{ id: number; sort: number }>`  
**エラー**: `SupabaseResponseError(LOCALE_ERROR_UNKNOWN)` をスロー

**ユースケース**: UI でのドラッグ&ドロップ並び替え

---

#### `create(...): Promise<DrinkRow>`
**用途**: 新しい飲み物を作成  
**クエリ**: `INSERT INTO drinks (name, color, amount, drink_label_id) VALUES (...)`  
**戻り値**: default color 付きで作成された飲み物  
**エラー**: `SupabaseResponseError(LOCALE_DRINKS_CREATE_FAILURE, { name })` をスロー

**デフォルト値**:
- `user_id`: RLS ポリシーで自動設定
- `sort`: 自動インクリメント（DB またはアプリで処理）
- `visible`: `true`

---

## 2. DrinkLabelsRepository

**ファイル**: `app/utils/api/drinkLabelsRepository.ts`  
**テーブル**: `public.drink_labels`

### Interface

```ts
export interface DrinkLabelsRepository {
  fetchAll(): Promise<DrinkLabelWithDefaultColor[]>
  deleteById(labelId: number, name: string): Promise<void>
  updateById(
    labelId: number,
    name: string,
    color: string | null,
    standardAmount: number,
    defaultDrinkId: number | null
  ): Promise<void>
  updateVisible(labelId: number, name: string, visible: boolean): Promise<void>
  updateSort(payload: Array<{ id: number; sort: number }>): Promise<void>
  create(
    name: string,
    color: string | null,
    standardAmount: number,
    defaultDrinkId: number | null
  ): Promise<DrinkLabelRow>
  fetchSummaryCount(year?: number, month?: number): Promise<DrinkLabelSummaryCountRow[]>
}

export type DrinkLabelRow = Database['public']['Tables']['drink_labels']['Row']
export type DrinkLabelWithDefaultColor = DrinkLabelRow & {
  readonly default_color: string
}
export type DrinkLabelSummaryCountRow = {
  drink_label_id: number
  count: number
}
```

### メソッド

#### `fetchAll(): Promise<DrinkLabelWithDefaultColor[]>`
**用途**: 現在のユーザーの全ラベルを取得  
**クエリ**: `SELECT * FROM drink_labels ORDER BY sort, id`  
**戻り値**: default color 付きのラベル配列

---

#### `fetchSummaryCount(year?, month?): Promise<DrinkLabelSummaryCountRow[]>`
**用途**: ラベル別に飲酒カウントを集計  
**RPC**: `aggregation_by_drink_labels(year, month)`  
**パラメータ**:
- `year`: 年フィルタ（任意）
- `month`: 月フィルタ（1-12、任意）

**戻り値**: `{ drink_label_id, count }` の配列  
**ユースケース**: 月次/年次のラベル統計

---

_（DrinksRepository と類似の CRUD メソッド）_

---

## 3. DrinkCountersRepository

**ファイル**: `app/utils/api/drinkCountersRepository.ts`  
**テーブル**: `public.drink_counters`

### Interface

```ts
export interface DrinkCountersRepository {
  fetchAll(): Promise<DrinkCounterRow[]>
  fetchByDate(date: string): Promise<DrinkCounterRow[]>
  fetchByMonth(year: number, month: number): Promise<DrinkCounterRow[]>
  fetchByPeriod(start: string, end: string): Promise<DrinkCounterRow[]>
  increment(rowId: number): Promise<void>
  decrement(rowId: number): Promise<void>
  create(drinkId: number, date: string, count: number): Promise<DrinkCounterRow>
  deleteById(id: number): Promise<void>
  sumCount(): Promise<Array<{ drink_id: number; count: number }>>
  sumCountPerMonth(year: number, month: number): Promise<Array<{ drink_id: number; count: number }>>
  sumCountPerYear(year: number): Promise<Array<{ drink_id: number; count: number }>>
  aggregationByDow(year?: number, month?: number): Promise<AggregationByDow[]>
}

export type DrinkCounterRow = Database['public']['Tables']['drink_counters']['Row']
export type AggregationByDow = {
  dow: number  // 曜日（0=日曜、6=土曜）
  sum_count: number
  avg_count: number
  max_type_of_drinks: number
  avg_type_of_drinks: number
  record_count: number
}
```

### メソッド

#### `fetchAll(): Promise<DrinkCounterRow[]>`
**用途**: ユーザーの全飲酒カウンターを取得  
**クエリ**: `SELECT * FROM drink_counters ORDER BY date DESC, drink_id`

---

#### `fetchByDate(date: string): Promise<DrinkCounterRow[]>`
**用途**: 特定日付のカウンターを取得  
**クエリ**: `SELECT * FROM drink_counters WHERE date = $1`  
**日付形式**: `YYYY-MM-DD`（締め時刻調整済み）

---

#### `fetchByMonth(year, month): Promise<DrinkCounterRow[]>`
**用途**: 月のカウンターを取得  
**クエリ**: `SELECT * FROM drink_counters WHERE date >= $1 AND date < $2`  
**ユースケース**: 月次集計ビュー

---

#### `fetchByPeriod(start: string, end: string): Promise<DrinkCounterRow[]>`
**用途**: 指定期間のカウンターを取得  
**クエリ**: `SELECT * FROM drink_counters WHERE count > 0 AND date >= $1 AND date < $2`  
**パラメータ**:
- `start`: 開始日 (YYYY-MM-DD)
- `end`: 終了日 (YYYY-MM-DD, 含まない)
**ユースケース**: カスタム期間集計、月次/週次レポート

---

#### `increment(rowId: number): Promise<void>`
**用途**: カウントを1増やす  
**RPC**: `increment(row_id)`  
**アトミック**: 同時実行の安全性のためデータベース関数を使用

---

#### `decrement(rowId: number): Promise<void>`
**用途**: カウントを1減らす（最小0）  
**RPC**: `decrement(row_id)`  
**制約**: カウントは0未満にならない

---

#### `sumCount(): Promise<Array<{ drink_id, count }>>`
**用途**: 飲み物ごとの総カウント（全期間）  
**RPC**: `sum_count()`

---

#### `sumCountPerMonth(year, month): Promise<...>`
**用途**: 飲み物ごとの月次合計  
**RPC**: `sum_count_per_month(year, month)`

---

#### `sumCountPerYear(year): Promise<...>`
**用途**: 飲み物ごとの年次合計  
**RPC**: `sum_count_per_year(year)`

---

#### `aggregationByDow(year?, month?): Promise<AggregationByDow[]>`
**用途**: 曜日別に集計  
**RPC**: `aggregation_by_dow(year, month)`  
**戻り値**: 曜日ごとにグループ化された統計  
**ユースケース**: 週次パターン分析

---

## 4. UserSettingsRepository

**ファイル**: `app/utils/api/userSettingsRepository.ts`  
**テーブル**: `public.user_settings`

### Interface

```ts
export interface UserSettingsRepository {
  fetchUserSettings(): Promise<UserSettingsRow | null>
  updateUserSettings(threshold: number, tz: string, timing: number): Promise<void>
}

export type UserSettingsRow = {
  threshold_for_detecting_overdrinking: number
  timezone: string
  switching_timing: number
}
```

### メソッド

#### `fetchUserSettings(): Promise<UserSettingsRow | null>`
**用途**: 現在のユーザー設定を取得  
**RPC**: `get_user_settings()`  
**戻り値**: 設定オブジェクトまたは未初期化の場合は NULL

**デフォルト値**（NULL の場合）:
```ts
{
  threshold_for_detecting_overdrinking: 2,
  timezone: 'Asia/Tokyo',
  switching_timing: 9
}
```

---

#### `updateUserSettings(threshold, tz, timing): Promise<void>`
**用途**: ユーザー設定を更新  
**RPC**: `update_user_settings(threshold, tz, timing)`  
**検証**:
- `threshold`: 正の整数（杯数）
- `tz`: 有効な IANA タイムゾーン文字列
- `timing`: 0〜23の整数（時）

---

## 共通パターン

### エラーメッセージキー
すべてのエラーメッセージは `app/utils/locales.ts` の i18n キーを使用:

```ts
export const LOCALE_ERROR_GET_RECORD = 'error.GET_RECORD'
export const LOCALE_DRINKS_DELETE_FAILURE = 'drinks.delete_failure'
export const LOCALE_DRINKS_UPDATE_FAILURE = 'drinks.update_failure'
export const LOCALE_DRINKS_CREATE_FAILURE = 'drinks.create_failure'
```

### 型安全性
すべてのメソッドは生成された TypeScript 型を使用:

```ts
import type { Database } from '~/types/database.types'

const TABLE_NAME = 'drinks' as const
type DrinkRow = Database['public']['Tables'][typeof TABLE_NAME]['Row']
```

### デフォルトカラー生成
リポジトリは UI フォールバック用に `default_color` プロパティを追加:

```ts
return (data ?? []).map((item) => ({
  ...item,
  default_color: generateRandomColor(),
}))
```

## テスト戦略

### Mock リポジトリ
```ts
const mockDrinksRepository: DrinksRepository = {
  fetchAll: vi.fn().mockResolvedValue([]),
  fetchById: vi.fn().mockResolvedValue(null),
  // ...
}
```

### テストカバレッジ
- ✅ 有効なデータでの成功ケース
- ✅ エラーケース（Supabase エラー）
- ✅ エッジケース（NULL 値、空の結果）
- ✅ RLS ポリシーの強制（統合テスト経由）

## 今後の拡張

- **キャッシュ層**: Redis/インメモリキャッシュの追加
- **バッチ操作**: 一括更新機能の拡張
- **楽観的更新**: データを即座に返し、後で同期
- **ページネーション**: カーソルベースのページネーションサポート追加
- **クエリビルダー**: 共通クエリパターンの抽象化

---

**関連ファイル**:
- リポジトリ実装: `app/utils/api/*Repository.ts`
- DI プラグイン: `app/plugins/repositories.ts`
- 型定義: `app/types/database.types.ts`
- エラークラス: `app/utils/customError.ts`
