# 機能仕様書

**最終更新**: 2025-12-10  
**ステータス**: Living Document  
**関連**: `app/pages/`, `store/pages/`, architecture.md

## 概要

Drink Counter は飲酒数を日付別・ラベル別に記録・可視化するアプリケーションです。主な機能は以下の6つです:

1. **日次飲酒記録** - 本日の飲酒杯数をカウント
2. **飲み物管理** - 酒の種類と容量を定義
3. **ラベル管理** - 飲み物をグループ化
4. **月次可視化** - 月別の飲酒データを集計・グラフ表示
5. **データ分析** - 年別/全期間の統計データ表示
6. **ユーザー設定** - タイムゾーン・閾値など個人設定

---

## ページ構成

### 1. ログインページ（`/login`）

**用途**: ユーザー認証  
**アクセス条件**: 未認証ユーザーのみ  
**認証ガード**: なし

#### 機能
```
┌─────────────────────────────────┐
│  Google Sign In Button          │
└─────────────────────────────────┘
```

#### フロー
1. ユーザーが「Googleアカウントを利用する」をクリック
2. `useSupabaseStore().signInWithGoogle()` を呼び出し
3. Google OAuth フローを実行
4. 認証後、コールバックページ（`/confirm`）にリダイレクト
5. セッション確立後、ホームページへ自動リダイレクト

#### 参照
- **Store**: `store/supabase/actions.ts` - `signInWithGoogle()`
- **認証方式**: Supabase Auth + Google OAuth
- **エラーハンドリング**: プラグイン（`plugins/error.client.ts`）で処理

---

### 2. 確認ページ（`/confirm`）

**用途**: OAuth コールバック処理  
**アクセス条件**: なし（外部リダイレクト用）  
**認証ガード**: なし

#### 機能
認証後の確認プロセスを実行し、ユーザーデータをロード

#### フロー
1. Google OAuth より `#access_token=...` をクエリパラメータで受け取り
2. Supabase CLI でセッション確立
3. `useUserStore().fetchUserData()` でユーザー情報を取得
4. ローカルストレージにセッション保存
5. ホームページにリダイレクト

#### 参照
- **Store**: `store/user/actions.ts` - `fetchUserData()`
- **ガード**: middleware 未適用

---

### 3. ホームページ（`/`）**Main Feature**

**用途**: 日次飲酒数カウント  
**アクセス条件**: 認証ユーザーのみ  
**認証ガード**: `auth` middleware

#### State
```ts
date: string                          // YYYY-MM-DD
labelsWithDrinks: {
  label: DrinkLabelRow
  drinks: DrinkRow[]
}[]
drinkCountForDay: DrinkCounterRow[]   // 本日の飲酒記録
```

#### UI コンポーネント

**Date Selector**:
```
< 2025-12-10 >
日付を選択し、その日のカウントを表示
```
- 左矢印: 前日を表示（サーバーで日付計算）
- 日付: タイムゾーン・締め時刻を考慮した日付

**Drink Groups** (ラベル別に分類):
```
┌──── [Label 1] ────┐
│ Drink 1: ▣▣▣ (3)  │  ◀︎ plus/minus ボタン
│ Drink 2: ▣ (1)    │
├───────────────────┤
│ Total: 4          │
└───────────────────┘
```

**Alert Modal** (飲み過ぎ警告):
```
┌──────────────────────────┐
│ 飲み過ぎが検出されました  │
│ 閾値: 2杯                 │
│ 現在: 3杯以上            │
│                          │
│ [続ける] [キャンセル]     │
└──────────────────────────┘
```
- 設定の `threshold_for_detecting_overdrinking` を超えると表示
- ユーザーが確認意思を示す必要あり

#### 主要アクション

**`setToday()`**
```ts
// タイムゾーン・締め時刻を考慮した現在の日付を設定
// useUserStore().calcDate() を利用
date.value = calcDate()
```

**`fetchNumberOfDrinks()`**
```ts
// date の drink_counters を取得
// ラベル別にグループ化して labelsWithDrinks を更新
await drinkCountersRepository.fetchByDate(date)
```

**`plus(drinkId: number, counterId?: number)`**
```ts
// 飲酒カウントを +1
// counterId が存在 → increment(counterId)
// counterId なし → create(drinkId, date, 1)

// UI: 飲み過ぎ警告をチェック
if (drinkCountForDay.length >= threshold) {
  modalIsActive = true  // 確認待ち
}
```

**`minus(drinkId: number, counterId: number)`**
```ts
// 飲酒カウントを -1
// decrement(counterId) を呼び出し
// count が 0 になった場合、レコード削除
```

**`updateDefaultDrink(drinkId: number)`**
```ts
// 最後に使用した飲み物をキャッシュ
// 次回のクイックアクション用
```

#### パフォーマンス考慮
- 日付変更時（`watch(date)`）に自動リロード
- `plus/minus` はデバウンス処理を検討
- ローディング状態を `showLoading()` / `hideLoading()` で表示

#### 参照
- **Store**: `store/pages/index/`
- **Repository**: `drinkCountersRepository.fetchByDate()`

---

### 4. 飲み物管理ページ（`/drinks`）

**用途**: 飲み物マスター（酒の種類・容量）の CRUD  
**アクセス条件**: 認証ユーザーのみ  
**認証ガード**: `auth` middleware

#### サブページ

##### 4a. 飲み物一覧（`/drinks`）

**機能**:
```
┌─ 飲み物一覧 ──────────────┐
│ [+ 新規追加]              │
├───────────────────────────┤
│ 🍺 Beer (500ml)           │ ✏️ 🗑️
│ 🍷 Wine (180ml)           │ ✏️ 🗑️
│ 🥃 Whisky (50ml)          │ ✏️ 🗑️
│                           │
│ [↕︎ ドラッグで並び替え]   │
└───────────────────────────┘
```

**State**:
```ts
drinks: DrinkRow[]           // 全飲み物
```

**アクション**:
- **新規追加**: `/drinks/new` にナビゲート
- **編集**: `/drinks/[id]` にナビゲート
- **削除**: 確認後、リポジトリで削除
- **ソート**: ドラッグアンドドロップで並び替え、`updateDrinkSort()` で保存

**参照**:
- **Store**: `store/data/drinks/` - `fetchDrinks()`, `deleteDrink()`
- **Store**: `store/pages/drinks/` - ソート・削除処理

---

##### 4b. 飲み物新規追加（`/drinks/new`）

**フロー**:
```
1. 初期化
   name: ''
   color: ランダムカラー
   amount: 1
   drinkLabelId: null

2. フォーム入力
   ┌──────────────────┐
   │ 名前: ___________│
   │ 容量: 1 _________│
   │ ラベル: [ラベル選択]
   │ 色: [カラーピッカー]
   │                  │
   │ [作成] [キャンセル]
   └──────────────────┘

3. 送信
   await createDrink(name, color, amount, drinkLabelId)
   → /drinks にリダイレクト（成功トースト）
```

**バリデーション**:
- 名前: 1文字以上
- 容量: 1 以上の数値
- ラベル: オプション

**参照**:
- **Store**: `store/pages/drinks/new/` - `initPage()`, `create()`

---

##### 4c. 飲み物編集（`/drinks/[id]`）

**フロー**:
```
1. ロード
   飲み物データをロード
   フォーム初期値に設定

2. 編集
   フォーム値を変更

3. 保存
   await updateDrink(id, name, color, amount, drinkLabelId)
   → /drinks にリダイレクト（成功トースト）
```

**参照**:
- **Store**: `store/pages/drinks/edit/` - `fetchDrink()`, `update()`

---

### 5. ラベル管理ページ（`/labels`）

**用途**: 飲み物グループ（ビール、ワイン等）の CRUD  
**アクセス条件**: 認証ユーザーのみ  
**認証ガード**: `auth` middleware

#### 機能は `飲み物管理ページ` と同様
```
- 新規追加: /labels/new
- 編集: /labels/[id]
- 削除: リスト画面から削除
- ソート: ドラッグアンドドロップで並び替え
```

**State**:
```ts
drinkLabels: DrinkLabelRow[]
```

**参照**:
- **Store**: `store/data/drinkLabels/`
- **Store**: `store/pages/labels/`（新規追加・編集・削除）

---

### 6. データ可視化ページ（`/data`）

**用途**: 飲酒データの統計分析  
**アクセス条件**: 認証ユーザーのみ  
**認証ガード**: `auth` middleware

#### サブページ

##### 6a. 月次ビュー（`/data/monthly`）

**用途**: 月別の飲酒データ集計

**UI**:
```
月選択: [< 2025-12 >]

統計情報:
┌──────────────────────┐
│ 総杯数: 45杯         │
│ 総容量: 2,250ml      │
│ 平均杯数: 1.5杯/日   │
└──────────────────────┘

グラフ 1. ラベル別集計（棒グラフ）
┌────────────────────┐
│ Beer    ■■■ (20)  │
│ Wine    ■■ (15)   │
│ Whisky  ■ (10)    │
└────────────────────┘

グラフ 2. 曜日別集計（折れ線グラフ）
┌────────────────────┐
│ 杯数    │          │
│        _/\_   _/\__
│  月火水木金土日
└────────────────────┘
```

**State**:
```ts
selectedYear: number
selectedMonth: number
aggregatedData: {
  byLabel: { label: string, count: number, volume: number }[]
  byDow: { dow: number, count: number }[]
  totalCount: number
  totalVolume: number
}
```

**アクション**:
- **月選択**: `setMonth(year, month)` → `fetchMonthlyData()` 呼び出し
- **前月/翌月**: 日付ロジックで自動計算

**参照**:
- **Store**: `store/pages/data/` - `fetchMonthlyData()`
- **Repository**: `drinkCountersRepository.aggregateByMonth()`

---

##### 6b. 年次ビュー（`/data/annual`）

**用途**: 年別の飲酒データ集計（月次グラフの年間版）

**UI**:
```
年選択: [< 2025 >]

統計情報:
┌─────────────────────┐
│ 総杯数: 450杯       │
│ 総容量: 22,500ml    │
│ 平均杯数: 1.2杯/日  │
└─────────────────────┘

グラフ: 月別集計（折れ線グラフ）
┌────────────────────┐
│ 杯数
│        ____
│      _/    \__  __/
│ 1月2月3月4月...12月
└────────────────────┘
```

**参照**:
- **Store**: `store/pages/data/` - `fetchAnnualData()`

---

##### 6c. 全期間ビュー（`/data/total`）

**用途**: アプリ使用開始からの累計統計

**UI**:
```
┌──────────────────────┐
│ 総杯数: 1,234杯      │
│ 総容量: 61,700ml     │
│ 利用開始: 2025-01-01│
│ 利用日数: 344日      │
│ 平均杯数: 3.6杯/日   │
│                      │
│ 最も飲んだラベル:    │
│ 🍺 Beer (500杯)      │
└──────────────────────┘

グラフ: 月別累積推移（スプライン）
┌────────────────────┐
│                 ╱
│              ╱
│          ╱
│      ╱
│ ___╱
│ 1月 2月 ... 12月
└────────────────────┘
```

**参照**:
- **Store**: `store/pages/data/` - `fetchTotalData()`

---

### 7. 設定ページ（`/settings`）

**用途**: ユーザー個人設定  
**アクセス条件**: 認証ユーザーのみ  
**認証ガード**: `auth` middleware

#### UI
```
┌─ 設定 ─────────────────────┐
│                            │
│ ユーザー情報               │
│ ━━━━━━━━━━━━━━━━━━━━━  │
│ 名前: [Username]           │
│ アバター: [画像]           │
│                            │
│ 飲酒設定                   │
│ ━━━━━━━━━━━━━━━━━━━━━  │
│ 飲み過ぎ警告閾値:          │
│ [2]杯 以上で警告表示       │
│                            │
│ タイムゾーン:              │
│ [Asia/Tokyo ▼]             │
│                            │
│ 日付切り替え時刻:          │
│ [5]時 (IANA UTC)          │
│                            │
│ [保存] [ログアウト]        │
└────────────────────────────┘
```

#### State
```ts
thresholdForDetectingOverdrinking: number
timezone: string
switchingTiming: number
```

#### 主要アクション

**`fetchSettings()`**
```ts
// useUserStore().userSetting から取得
// または user_settings テーブルから直接取得
```

**`updateSettings()`**
```ts
// 入力検証
if (threshold < 1) showErrorToast()
if (!isValidTimezone(timezone)) showErrorToast()
if (switchingTiming < 0 || switchingTiming > 23) showErrorToast()

// 保存
await userSettingsRepository.updateUserSettings({
  threshold_for_detecting_overdrinking,
  timezone,
  switching_timing,
})

// ストア更新
useUserStore().userSetting = ...

showSuccessToast('設定を更新しました')
```

**`logout()`**
```ts
// useSupabaseStore().signOut()
// → /login にリダイレクト
```

#### 参照
- **Store**: `store/pages/settings/` - `fetchSettings()`, `updateSettings()`
- **User Store**: `useUserStore().userSetting`

---

### 8. About ページ（`/about`）

**用途**: アプリ情報  
**アクセス条件**: なし  
**認証ガード**: なし

#### コンテンツ
- プロジェクト説明
- バージョン情報
- ライセンス（MIT）
- GitHub リンク

---

## クロスカッティング機能

### 認証フロー

```
未認証
    ↓
/login (Google OAuth)
    ↓
/confirm (セッション確立)
    ↓
認証済み（useSupabaseUser() != null）
    ↓
任意のページにアクセス可能
    
ログアウト
    ↓
/login にリダイレクト
```

**ガード実装**: `app/middleware/auth.ts`
```ts
if (!useSupabaseUser().value && !route.name?.includes('login')) {
  return navigateTo(localePath('/login'))
}
```

---

### エラー処理フロー

```
1. Repository レイヤー
   → CustomError をスロー

2. Store (data/) レイヤー
   → エラー再スロー（処理なし）

3. Store (pages/) レイヤー
   → エラーをキャッチ
   → トーストメッセージ表示
   → logger.error() でログ記録

4. Component
   → store action 呼び出し
   → ユーザーはトーストで通知受け取り
```

**トースト種類**:
- `showSuccessToast()` - 操作成功
- `showInfoToast()` - 情報通知
- `showWarningToast()` - 警告（続行可能）
- `showDangerToast()` - エラー（操作失敗）

**参照**: `app/utils/toast.ts`

---

### ローディング状態管理

```
ページロード時:
  showLoading()
  ↓
データ取得
  ↓
hideLoading()

非同期操作中:
  showLoading()（オプション）
  ↓
操作完了
  ↓
hideLoading()
```

**実装**: `useAppStore().isLoading`

---

## 今後の拡張機能

- 📊 **詳細フィルタリング**: 日付範囲・ラベル別に絞り込み
- 📁 **データエクスポート**: CSV/JSON 形式でダウンロード
- 🔔 **通知機能**: 定時リマインダー
- 👥 **シェア機能**: グループでカウント共有
- 📱 **オフラインサポート**: ローカルキャッシング・同期
- 🎯 **目標管理**: 月次/年次の飲酒目標設定
- 🌙 **ダークモード**: テーマ切り替え
- 📈 **詳細統計**: 標準偏差・トレンド分析
- 🔐 **2要素認証**: セキュリティ強化

---

**関連ファイル**:
- Pages: `app/pages/**/*.vue`
- Stores: `store/pages/*/`
- Components: `app/components/`
- Architecture: `.agent/specs/architecture.md`
- State Management: `.agent/specs/state-management.md`
