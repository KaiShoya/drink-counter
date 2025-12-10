# 状態管理仕様

**最終更新**: 2025-12-10  
**ステータス**: Living Document  
**関連**: `store/`, `architecture.md`

## 概要

Drink Counter は、明確な階層化戦略を持つ **Pinia** を状態管理に使用しています:
- **データ層**（`store/data/`）: データベーステーブルをミラーリング
- **プレゼンテーション層**（`store/pages/`）: ページ固有の集約された状態
- **グローバル状態**（`store/app/`, `store/user/`, `store/supabase/`）

## Store アーキテクチャ

### Store パターン
各 store は Composition API パターンに従い、明示的に分離されています:

```ts
export const useExampleStore = defineStore('exampleStore', () => {
  return {
    ...useExampleState(),
    ...useExampleGetters(),
    ...useExampleActions(),
  }
})
```

### モジュール構造
```
store/<storeName>/
├── index.ts       # Store 定義
├── state.ts       # リアクティブな状態
├── getters.ts     # 算出プロパティ
└── actions.ts     # 非同期操作
```

---

## グローバルストア

### 1. App Store（`store/app/`）

**用途**: アプリケーション全体の UI 状態

#### State
```ts
const isLoading = ref<boolean>(false)
```

#### Actions
```ts
const showLoading = () => { isLoading.value = true }
const hideLoading = () => { isLoading.value = false }
```

**使用方法**:
```ts
const { showLoading, hideLoading } = useAppStore()
const { isLoading } = storeToRefs(useAppStore())
```

---

### 2. User Store（`store/user/`）

**用途**: ユーザーセッションと設定管理

#### State
```ts
const isLogin = ref<boolean>(false)
const userName = ref<string | null>(null)
const userAvatarUrl = ref<string | null>(null)
const userSetting = ref<UserSettingsRow>({
  threshold_for_detecting_overdrinking: 2,
  timezone: 'Asia/Tokyo',
  switching_timing: 9,
})
const isInitialized = ref<boolean>(false)
```

#### Getters
```ts
/**
 * タイムゾーンと締め時刻で調整された現在の日付を計算
 * @returns YYYY-MM-DD 文字列
 */
const calcDate = (): string
```

**ロジック**:
1. ユーザーのタイムゾーンで現在時刻を取得
2. 時刻 < `switching_timing` の場合、1日引く
3. `YYYY-MM-DD` 形式でフォーマット

**例**:
- 現在時刻: `2025-12-10 03:00`（Asia/Tokyo）
- 締め時刻: `5:00`
- 結果: `2025-12-09`（前日）

#### Actions
```ts
const fetchUserData = async (): Promise<void>
```

**フロー**:
1. Claims（JWT）用に `useSupabaseUser()` をチェック
2. ログインしている場合、ユーザーメタデータ（name, avatar）を取得
3. `user_settings` テーブルからユーザー設定を取得
4. 状態を更新

**エラーハンドリング**: `SupabaseAuthError` または `SupabaseResponseError` をスロー

---

### 3. Supabase Store（`store/supabase/`）

**用途**: 認証アクション

#### State
```ts
const supabase = useSupabaseClient<Database>()
```

#### Actions

##### `signUpWithEmail(email: string, password: string)`
**用途**: メール/パスワード登録  
**Supabase メソッド**: `auth.signUp({ email, password })`  
**戻り値**: ユーザーデータ  
**エラー**: `SupabaseAuthError` をスロー

---

##### `signInWithEmail(email: string, password: string)`
**用途**: メール/パスワードログイン  
**Supabase メソッド**: `auth.signInWithPassword({ email, password })`  
**戻り値**: セッションオブジェクト  
**エラー**: `SupabaseAuthError` をスロー

---

##### `signInWithGoogle()`
**用途**: Google OAuth ログイン  
**Supabase メソッド**: `auth.signInWithOAuth({ provider: 'google' })`  
**リダイレクト**: `/confirm` ページ（コールバック処理）  
**エラー**: `SupabaseAuthError` をスロー

---

##### `signOut()`
**用途**: 現在のユーザーをログアウト  
**Supabase メソッド**: `auth.signOut()`  
**副作用**: セッションをクリア、ログインにリダイレクト  
**エラー**: `SupabaseAuthError` をスロー

---

## データ層ストア（`store/data/`）

### 設計原則
1. **データベースをミラー**: 状態構造は Supabase テーブルに一致
2. **エラーコードを返す**: トーストメッセージは表示しない
3. **純粋な CRUD**: ビジネスロジックの集約なし
4. **Repository パターン**: 注入されたリポジトリを使用

### 共通パターン
```ts
export const useDrinksStore = defineStore('drinksStore', () => {
  const drinks = ref<DrinkRow[]>([])
  
  const fetchDrinks = async (): Promise<void> => {
    const { $drinksRepository } = useNuxtApp()
    try {
      drinks.value = await $drinksRepository.fetchAll()
    } catch (error) {
      // page store での処理のため再スロー
      throw error
    }
  }
  
  return { drinks: readonly(drinks), fetchDrinks }
})
```

### 1. Drinks Store（`store/data/drinks/`）

#### State
```ts
const drinks = ref<DrinkRow[]>([])
```

#### Actions
- `fetchDrinks()`: 全飲み物をロード
- `createDrink(...)`: 新しい飲み物を作成
- `updateDrink(...)`: 飲み物のプロパティを更新
- `deleteDrink(id, name)`: 飲み物を削除
- `updateDrinkSort(payload)`: ソート順を一括更新

**エラーハンドリング**: page store でキャッチするためリポジトリエラーをスロー

---

### 2. Drink Labels Store（`store/data/drinkLabels/`）

#### State
```ts
const drinkLabels = ref<DrinkLabelRow[]>([])
```

#### Actions
- `fetchDrinkLabels()`: 全ラベルをロード
- `createLabel(...)`: 新しいラベルを作成
- `updateLabel(...)`: ラベルのプロパティを更新
- `deleteLabel(id, name)`: ラベルを削除
- `updateLabelSort(payload)`: ソート順を一括更新
- `fetchLabelSummary(year, month)`: ラベル別にカウントを集計

---

## プレゼンテーション層ストア（`store/pages/`）

### 設計原則
1. **データを集約**: 複数のデータストアを組み合わせ
2. **トーストメッセージを表示**: ユーザーフィードバック付きでエラーを処理
3. **ビジネスロジック**: ページ固有の計算
4. **直接的なリポジトリアクセスなし**: データストアを使用

### 共通パターン
```ts
export const useIndexStore = defineStore('indexStore', () => {
  const { $drinksRepository } = useNuxtApp()
  const drinksStore = useDrinksStore()
  
  const fetchData = async () => {
    try {
      await drinksStore.fetchDrinks()
    } catch (error) {
      // トーストメッセージを表示
      if (error instanceof CustomError) {
        showDangerToast(error.getMessage())
      }
      throw error
    }
  }
  
  return { fetchData }
})
```

### 1. Index Store（`store/pages/index/`）

**用途**: ホームページ状態（日次飲酒カウンター）

#### State
```ts
const date = ref<string>('')  // YYYY-MM-DD
const labelsWithDrinks = ref<Array<{
  label: DrinkLabelRow
  drinks: DrinkRow[]
}>>([])
const drinkCountForDay = ref<DrinkCounterRow[]>([])
```

#### Actions

##### `setToday()`
**用途**: `date` を現在の日付に設定（締め時刻調整済み）  
**使用**: `useUserStore().calcDate()`

---

##### `fetchNumberOfDrinks()`
**用途**: 現在の日付の飲酒カウンターをロード  
**フロー**:
1. `date` の `drinkCountForDay` を取得
2. 飲み物をラベル別にグループ化
3. `labelsWithDrinks` を更新

---

##### `plus(drinkId: number)`
**用途**: 飲酒カウントを増やす  
**フロー**:
1. `(drinkId, date)` の既存カウンターを検索
2. 存在する場合 → `increment(rowId)` を呼び出し
3. 存在しない場合 → `create(drinkId, date, 1)` を呼び出し
4. `drinkCountForDay` を更新

**UI フィードバック**: 成功トーストを表示

---

##### `minus(drinkId: number)`
**用途**: 飲酒カウントを減らす  
**フロー**:
1. 既存カウンターを検索
2. `decrement(rowId)` を呼び出し
3. カウントが0になった場合、オプションでレコードを削除
4. データを更新

---

### 2. Data Store（`store/pages/data/`）

**用途**: データ可視化ページ（月次、年次、トータル）

#### State
```ts
const selectedYear = ref<number>(new Date().getFullYear())
const selectedMonth = ref<number>(new Date().getMonth() + 1)
const aggregatedData = ref<AggregationData>({
  byLabel: [],
  byDow: [],
  totalCount: 0,
  totalVolume: 0,
})
```

#### Actions

##### `fetchMonthlyData(year, month)`
**用途**: 月次ビュー用にデータを集計  
**フロー**:
1. 月の `drink_counters` を取得
2. `drinks` と `drink_labels` と JOIN
3. 計算:
   - 総カウント: `SUM(count)`
   - 総容量: `SUM(drinks.amount * count)`
   - ラベル別: `drink_label_id` でグループ化
   - 曜日別: `aggregation_by_dow()` を使用

**キャッシング**: パフォーマンスのため結果のキャッシングを検討

---

### 3. Settings Store（`store/pages/settings/`）

**用途**: ユーザー設定管理

#### State
```ts
const thresholdForDetectingOverdrinking = ref<number>(2)
const timezone = ref<string>('Asia/Tokyo')
const switchingTiming = ref<number>(9)
```

#### Actions

##### `fetchSettings()`
**用途**: ユーザー設定をロード  
**フロー**:
1. `userSettingsRepository.fetchUserSettings()` を呼び出し
2. ローカル状態を更新
3. NULL の場合、デフォルト値を使用

---

##### `updateSettings()`
**用途**: ユーザー設定を保存  
**フロー**:
1. 入力を検証
2. `userSettingsRepository.updateUserSettings(...)` を呼び出し
3. `useUserStore().userSetting` を更新
4. 成功トーストを表示

**検証**:
- `threshold >= 1`
- `timezone` は有効な IANA 文字列
- `switchingTiming` は 0〜23 の範囲

---

## 状態のリアクティビティ

### storeToRefs
リアクティビティを保持するため常に `storeToRefs()` を使用:

```ts
// ❌ 誤り - リアクティビティを失う
const { drinks } = useDrinksStore()

// ✅ 正しい
const { drinks } = storeToRefs(useDrinksStore())
```

### Readonly 状態
直接的な変更を防ぐため、状態を readonly として公開:

```ts
return {
  drinks: readonly(drinks),
  fetchDrinks,
}
```

---

## エラーハンドリング戦略

### Data Stores
```ts
const fetchDrinks = async () => {
  try {
    drinks.value = await $drinksRepository.fetchAll()
  } catch (error) {
    // 単に再スロー、page store に処理させる
    throw error
  }
}
```

### Page Stores
```ts
const fetchData = async () => {
  try {
    await drinksStore.fetchDrinks()
  } catch (error) {
    // トーストを表示してログ
    if (error instanceof CustomError) {
      showDangerToast(error.getMessage())
    }
    logger.error('Failed to fetch', { module: 'indexStore' }, error)
  }
}
```

---

## テスト戦略

### @pinia/testing での Store テスト

```ts
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'

describe('DrinksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('飲み物を正常に取得する', async () => {
    const store = useDrinksStore()
    await store.fetchDrinks()
    expect(store.drinks).toHaveLength(0)  // またはモックデータ
  })
})
```

### Mock リポジトリ
```ts
vi.doMock('#imports', () => ({
  useNuxtApp: () => ({
    $drinksRepository: {
      fetchAll: vi.fn().mockResolvedValue([]),
    },
  }),
}))
```

---

## パフォーマンス考慮事項

### 遅延ロード
- 必要な時だけデータを取得
- UX のため `showLoading()` / `hideLoading()` を使用

### デバウンス
- 高速な increment/decrement 呼び出しをデバウンス
- `useDebounceFn()` composable を使用

### キャッシング
- page store で集約データをキャッシュ
- データ変更時に無効化

---

## 今後の拡張

- **楽観的更新**: UI を即座に更新、後で同期
- **オフラインサポート**: オフライン時にアクションをキューイング
- **リアルタイム同期**: マルチデバイス同期のため Supabase Realtime
- **Store 永続化**: localStorage に状態を保存
- **Middleware**: ログ/分析用の store レベル middleware

---

**関連ファイル**:
- Store 実装: `store/**/*.ts`
- アーキテクチャ: `.agent/specs/architecture.md`
- Repository API: `.agent/specs/repository-api.md`
- 型定義: `app/types/database.types.ts`
