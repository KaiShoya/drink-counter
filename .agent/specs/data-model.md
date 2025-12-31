# データモデル仕様

**最終更新**: 2025-12-10  
**ステータス**: Living Document  
**関連**: `docs/db/index.md`, `app/types/database.types.ts`

## 概要

Drink Counter は **Supabase** 経由で **PostgreSQL** を使用し、マルチテナントデータ分離のために **Row-Level Security（RLS）** を採用しています。

## データベーススキーマ

### ER 図サマリー

```
users (auth.users)
  ↓ 1:1
user_settings
  
users
  ↓ 1:N
drink_labels → drinks
               ↓ 1:N
             drink_counters
  
users
  ↓ 1:N
drinks → drink_counters
```

## テーブル定義

### 1. `auth.users`（Supabase Auth）
**用途**: ユーザー認証と識別情報  
**所有者**: Supabase Auth（管理対象）

| カラム | 型 | 説明 |
|--------|------|-------------|
| `id` | `uuid` | 主キー |
| `email` | `varchar` | ユーザーメールアドレス |
| `created_at` | `timestamp` | アカウント作成タイムスタンプ |

**備考**:
- Supabase Auth により管理
- ユーザーメタデータ（`name`, `avatar_url`）は `user_metadata` JSONB フィールドに格納

---

### 2. `public.user_settings`
**用途**: ユーザー固有のアプリケーション設定  
**所有者**: Application

| カラム | 型 | 制約 | 説明 |
|--------|------|-------------|-------------|
| `id` | `int8` | PK, IDENTITY | 自動インクリメント主キー |
| `user_id` | `uuid` | FK → `auth.users.id` | ユーザー参照 |
| `threshold_for_detecting_overdrinking` | `int2` | NOT NULL | 1日の飲酒閾値（杯数） |
| `timezone` | `text` | NOT NULL | IANA タイムゾーン（例: `Asia/Tokyo`） |
| `switching_timing` | `int2` | NOT NULL | 日付切り替え時刻（0-23） |
| `name` | `text` | NULL | 表示名 |
| `avatar_url` | `text` | NULL | アバター画像 URL |
| `created_at` | `timestamp` | DEFAULT now() | レコード作成タイムスタンプ |

**RLS ポリシー**:
- ユーザーは自分の設定のみアクセス可能（`user_id = auth.uid()`）

**関数**:
- `get_user_settings()`: 現在のユーザー設定を取得
- `update_user_settings(threshold, tz, timing)`: ユーザー設定を更新

**インデックス**:
- `user_id` にユニークインデックス

---

### 3. `public.drink_labels`
**用途**: 飲み物カテゴリ/ラベルのマスターテーブル  
**所有者**: Application

| カラム | 型 | 制約 | 説明 |
|--------|------|-------------|-------------|
| `id` | `int8` | PK, IDENTITY | 自動インクリメント主キー |
| `user_id` | `uuid` | FK → `auth.users.id` | ユーザー参照 |
| `name` | `text` | NOT NULL | ラベル名（例: "ビール", "ワイン"） |
| `color` | `text` | NULL | 16進数カラーコード |
| `sort` | `int4` | NOT NULL | 表示順序 |
| `visible` | `bool` | NOT NULL, DEFAULT true | 表示フラグ |
| `standard_amount` | `int4` | NULL | 標準量（ml） |
| `default_drink_id` | `int8` | FK → `drinks.id` | このラベルのデフォルト飲み物 |
| `created_at` | `timestamp` | DEFAULT now() | レコード作成タイムスタンプ |

**RLS ポリシー**:
- ユーザーは自分のラベルのみアクセス可能（`user_id = auth.uid()`）

**関数**:
- `aggregation_by_drink_labels(year, month)`: ラベル別に飲み物を集計
- `bulk_update_drink_labels_sort(payload)`: ソート順を一括更新

**インデックス**:
- `user_id, sort, id` にインデックス
- `default_drink_id` に外部キーインデックス

**ビジネスルール**:
- `sort` が UI での表示順序を決定
- `visible = false` でデフォルトビューから非表示
- ラベル削除時は飲み物を他のラベルに再割り当てが必要な場合あり

---

### 4. `public.drinks`
**用途**: 具体的な飲み物種別のマスターテーブル  
**所有者**: Application

| カラム | 型 | 制約 | 説明 |
|--------|------|-------------|-------------|
| `id` | `int8` | PK, IDENTITY | 自動インクリメント主キー |
| `user_id` | `uuid` | FK → `auth.users.id` | ユーザー参照 |
| `drink_label_id` | `int8` | FK → `drink_labels.id`, NULL | 親ラベル（任意） |
| `name` | `varchar` | NOT NULL | 飲み物名（例: "アサヒスーパードライ"） |
| `color` | `varchar` | NULL | 16進数カラーコード（ラベルの色を上書き） |
| `amount` | `int4` | NOT NULL | 容量（ml） |
| `sort` | `int4` | NOT NULL | 表示順序 |
| `visible` | `bool` | NOT NULL, DEFAULT true | 表示フラグ |
| `created_at` | `timestamp` | DEFAULT now() | レコード作成タイムスタンプ |

**RLS ポリシー**:
- ユーザーは自分の飲み物のみアクセス可能（`user_id = auth.uid()`）

**関数**:
- `delete_drink_data(drinkid)`: 飲み物と関連カウンターを削除
- `bulk_update_drinks_sort(payload)`: ソート順を一括更新

**インデックス**:
- `user_id, sort, id` にインデックス
- `drink_label_id` に外部キーインデックス

**ビジネスルール**:
- `amount` は必須（最小 1ml）
- `color` が NULL の場合、親ラベルの色またはデフォルトのランダム色を使用
- `drink_label_id` が NULL の場合、未分類の飲み物
- 飲み物削除時は `drink_counters` にカスケード

---

### 5. `public.drink_counters`
**用途**: 日別飲酒カウントのトランザクションテーブル  
**所有者**: Application

| カラム | 型 | 制約 | 説明 |
|--------|------|-------------|-------------|
| `id` | `int8` | PK, IDENTITY | 自動インクリメント主キー |
| `user_id` | `uuid` | FK → `auth.users.id`, DEFAULT auth.uid() | ユーザー参照 |
| `drink_id` | `int8` | FK → `drinks.id` | 飲み物参照 |
| `date` | `date` | NOT NULL | 記録日付（締め時刻調整後） |
| `count` | `int4` | NOT NULL | 飲んだ回数 |
| `created_at` | `timestamp` | DEFAULT now() | レコード作成タイムスタンプ |

**RLS ポリシー**:
- ユーザーは自分のカウンターのみアクセス可能（`user_id = auth.uid()`）

**関数**:
- `increment(row_id)`: カウントを1増やす
- `decrement(row_id)`: カウントを1減らす（最小0）
- `sum_count()`: ユーザーの総カウント
- `sum_count_per_month(year, month)`: 月次集計
- `sum_count_per_year(year)`: 年次集計
- `aggregation_by_dow(year, month)`: 曜日別集計

**インデックス**:
- `user_id, date, drink_id` にインデックス
- `drink_id`, `user_id` に外部キーインデックス

**ビジネスルール**:
- **日付計算**: `date` はユーザーの `switching_timing` に基づいて調整
  - タイムスタンプ < 締め時刻 → 前日扱い
  - アプリケーションロジックで insert 前に処理
- **カウント制約**: `count >= 0`
- **ユニーク制約**: `(user_id, drink_id, date)` ごとに1レコード（インデックスで強制）

**集計ロジック**:
- 総飲酒数: `SUM(count)`
- 総容量（ml）: `SUM(drinks.amount * count)`（JOIN が必要）
- アクティブ日数: `COUNT(DISTINCT date) WHERE count > 0`

---

## 型生成

TypeScript 型は Supabase スキーマから自動生成されます:

```bash
supabase gen types --lang=typescript --local > app/types/database.types.ts
```

### 型使用例

```ts
import type { Database } from '~/types/database.types'

type DrinkRow = Database['public']['Tables']['drinks']['Row']
type DrinkInsert = Database['public']['Tables']['drinks']['Insert']
type DrinkUpdate = Database['public']['Tables']['drinks']['Update']
```

## マイグレーション

### マイグレーションワークフロー

1. **スキーマ変更**をローカル Supabase で実施（Studio または SQL）
2. **マイグレーションファイルを生成**:
   ```bash
   supabase db diff -f <migration_name>
   ```
3. **型を再生成**:
   ```bash
   supabase gen types --lang=typescript --local > app/types/database.types.ts
   ```
4. **ローカルテスト**を seed data で実施
5. マイグレーションファイルを `supabase/migrations/` に**コミット**
6. 本番 Supabase に**デプロイ**

### マイグレーション命名規約

```
YYYYMMDDHHMMSS_<description>.sql
```

例:
```
20231103035147_add_columns_to_drinks.sql
```

## データ整合性ルール

### 参照整合性
- 適切な場所で CASCADE DELETE ポリシーを持つ外部キー
- ユーザー削除 → 関連データすべてにカスケード（Supabase が処理）
- 飲み物削除 → `drink_counters` にカスケード
- ラベル削除 → 手動で再割り当てまたはカスケードが必要

### データ検証
- **アプリケーションレベル**: リポジトリで強制
- **データベースレベル**: 制約、トリガー、RLS ポリシー

### タイムゾーン処理
- すべてのタイムスタンプは UTC で保存
- `user_settings.timezone` に基づいて表示を調整
- 日付締め時刻はアプリケーションロジックで適用

## パフォーマンス考慮事項

### インデックス
- 頻繁にクエリされるカラムに複合インデックス
- JOIN パフォーマンス向上のための外部キーインデックス

### 集計戦略
- 複雑な集計にはデータベース関数を使用
- 高コストなクエリにはマテリアライズドビューを検討（将来的な拡張）

### ページネーション
- 大規模データセット向けにカーソルベースのページネーションを実装
- `limit` と `offset` は慎重に使用

## セキュリティ

### Row-Level Security (RLS)
- **全テーブルで有効化**
- ポリシーで `user_id = auth.uid()` を強制
- INSERT ポリシーで `user_id` を自動設定

### データ分離
- RLS によるマルチテナンシー
- ユーザー間でのデータ漏洩なし

### 機密データ
- メール以外に PII を保存しない（`auth.users` 内）
- ユーザー設定にタイムゾーンを含む（非機密）

## 今後の拡張

- **監査ログ**: マスターデータの変更履歴を追跡
- **論理削除**: 復元可能な削除のため `deleted_at` カラムを追加
- **ABV 追跡**: drinks テーブルにアルコール度数（ABV）を追加
- **タグ/カテゴリ**: ラベル以外の追加分類
- **共有**: ユーザー間での飲み物リスト共有機能

---

**関連ファイル**:
- スキーマ図: `docs/db/index.md`
- 型定義: `app/types/database.types.ts`
- マイグレーションファイル: `supabase/migrations/`
- シードデータ: `supabase/seed.sql`
