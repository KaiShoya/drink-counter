# 📋 ドキュメント管理とタスク管理

## ディレクトリ構造

このプロジェクトでは、エージェント駆動のドキュメント管理に `.agent/` ディレクトリを使用します:

```
.agent/
  ├── docs/       # 作業用ドキュメント（QA、タスク、未決定事項）
  └── specs/      # 仕様の信頼できる情報源
```

**重要**: プロジェクトに `.agent/` ディレクトリが存在しない場合、必要に応じて自動的に作成してください。

## 📝 ドキュメント管理ガイドライン

### `.agent/docs/` - 作業用ドキュメント

このディレクトリの用途:
- **QA リスト**: カテゴリ付きの質問と回答形式
  - 形式: `## [カテゴリ] 質問` → `**回答**: ...`
  - カテゴリ例: `[API]`, `[UI]`, `[アーキテクチャ]`, `[テスト]` など
- **未決定事項**: 今後の議論で解決すべき未解決の問題
  - 形式: `- [ ] 問題の説明（コンテキスト、影響、選択肢）`
- **タスクリスト**: GitHub Issues と連携した開発タスク
  - 形式: `- [ ] タスクの説明 #issue_number`

**推奨される QA 形式**:
```markdown
## [カテゴリ] 質問のタイトル

**質問**: 詳細な質問の説明

**回答**: 根拠を含めた回答

**決定日**: YYYY-MM-DD
**関連**: #issue_number（該当する場合）
```

### `.agent/specs/` - 仕様（信頼できる情報源）

このディレクトリには、システムの**現在の状態**を表す確定済みの仕様が含まれます。

**対象範囲**: アーキテクチャ、API設計、データモデル、ビジネスロジック、システム全体の仕様。

**対象外**: コンポーネント単位や画面単位の仕様は、コンポーネントファイル内のカスタム `<spec>` ブロックで管理します。

**重要なルール**: コードを変更した場合、`.agent/specs/` も**必ず**更新してください。

#### 利用可能な仕様書

- **`architecture.md`**: システム全体アーキテクチャ、技術スタック、各層の責務
  - **参照タイミング**: 新機能追加、新しい composable/store/repository 作成時
  - **キー情報**: ディレクトリ構造、設計パターン、タイムゾーン処理、i18n 戦略

- **`data-model.md`**: Supabase スキーマ、テーブル定義、RLS ポリシー、マイグレーション
  - **参照タイミング**: データベース操作、型定義の確認、スキーマ変更計画時
  - **キー情報**: 5テーブル（auth.users, user_settings, drink_labels, drinks, drink_counters）、外部キー、インデックス

- **`repository-api.md`**: Repository パターン実装、CRUD API、エラーハンドリング戦略
  - **参照タイミング**: `store/data/` ストア実装、データアクセス方法確認時
  - **キー情報**: 4リポジトリ（Drinks, DrinkLabels, DrinkCounters, UserSettings）、メソッド仕様、エラー処理

- **`state-management.md`**: Pinia ストア設計、グローバル/データ層/プレゼンテーション層の責務
  - **参照タイミング**: ストア実装、状態管理戦略確認時
  - **キー情報**: Store レイアウト（3層構造）、`storeToRefs()` 使用方法、トーストメッセージタイミング

- **`features.md`**: ユーザー機能仕様、ページ構成、UI フロー、クロスカッティング機能
  - **参照タイミング**: 新ページ追加、ユーザーフロー確認、機能要件理解時
  - **キー情報**: 8ページ仕様（ログイン、ホーム、飲み物管理、ラベル管理、データ分析、設定）、認証フロー、エラー処理フロー

## 🔄 ワークフロー

### チャットでのやり取り中

1. **要件を明確化**: 会話内で Q&A を通じて要件を詰める
2. **決定事項を記録**: 区切りの良いタイミングで `.agent/docs/` に記録
3. **仕様を更新**: 決定事項が確定したら `.agent/specs/` を更新
4. **GitHub Issues にリンク**: タスク追跡のために Issue と紐付け

### コードを変更する場合

**必ずこの順序に従ってください**:

1. ✅ コード変更を実装
2. ✅ 関連する `.agent/specs/` ファイルを更新
3. ✅ コミットメッセージに仕様更新を記載
4. ✅ （PR の場合）PR の説明に仕様変更を含める

**コミットメッセージの例**:
```
feat: 日付範囲によるドリンクフィルタリングを追加

- DrinksRepository にフィルタロジックを実装
- UI コンポーネントを更新
- .agent/specs/drinks-api.md に新しいエンドポイントを追加
```

## 🏗️ 実装ガイドライン

### Store 実装パターン

**責務分離**: Data Stores と Page Stores を厳格に分離

#### Data Stores（`store/data/`）
```ts
// 単純な CRUD + リポジトリ呼び出し
const fetchDrinks = async () => {
  try {
    drinks.value = await $drinksRepository.fetchAll()
  } catch (error) {
    // 単に再スロー（トーストなし）
    throw error
  }
}

// 状態は readonly で公開
return {
  drinks: readonly(drinks),
  fetchDrinks,
}
```

**ルール**:
- ✅ リポジトリを直接呼び出し
- ✅ エラーはそのまま再スロー
- ✅ トーストメッセージは表示しない
- ✅ 状態は `readonly()` で公開
- ❌ 複数ストアの組み合わせなし
- ❌ ビジネスロジック・集約なし

#### Page Stores（`store/pages/`）
```ts
// 複数の data store + エラー処理 + トースト表示
const fetchData = async () => {
  try {
    showLoading()
    await drinksStore.fetchDrinks()
    // データ集約・変換処理
  } catch (error) {
    if (error instanceof CustomError) {
      showDangerToast(error.getMessage())
    }
    logger.error('Failed to fetch', { module: 'indexStore' }, error)
  } finally {
    hideLoading()
  }
}
```

**ルール**:
- ✅ 複数のデータストアを組み合わせ
- ✅ エラーをキャッチしてトーストを表示
- ✅ 集約・変換ロジックを実装
- ✅ ログレコーディングを実施
- ✅ ローディング状態を管理
- ❌ リポジトリの直接呼び出しなし
- ❌ エラー処理なしの再スロー

### エラーハンドリング階層図

```
Component
    ↓ (store action 呼び出し)
Page Store ← トーストを表示、ログ記録
    ↓ (data store 呼び出し)
Data Store ← 単に再スロー
    ↓ (repository 呼び出し)
Repository ← CustomError をスロー
    ↓
Supabase API
```

**各層の責務**:

1. **Repository** (`app/utils/api/`)
   - Supabase エラーをキャッチ
   - `CustomError` に変換してスロー
   - メッセージは実装者向け（英語）

2. **Data Store** (`store/data/`)
   - エラーを単に再スロー
   - 処理なし（Page Store に任せる）

3. **Page Store** (`store/pages/`)
   - エラーをキャッチ
   - `showDangerToast()` でユーザーに通知
   - `logger.error()` でログ記録
   - 必要に応じて UI 状態をリセット

4. **Component** (`app/components/`)
   - Page Store action を呼び出し
   - ストア経由でユーザーに通知
   - 直接的なエラー処理は不要

**トースト種類**:
```ts
showSuccessToast('操作が成功しました')        // 緑
showInfoToast('確認メッセージです')           // 青
showWarningToast('注意が必要です')            // 黄
showDangerToast('エラーが発生しました')       // 赤
```

**例**: 飲み物削除
```ts
// Page Store: deleteAction
const deleteDrink = async (id: number, name: string) => {
  try {
    showLoading()
    await drinksStore.deleteDrink(id)
    showSuccessToast(
      t(LOCALE_DRINKS_DELETE_SUCCESS, { name })
    )
    await fetchDrinks()  // リロード
  } catch (error) {
    if (error instanceof CustomError) {
      showDangerToast(error.getMessage())
    }
    logger.error('Failed to delete drink', 
      { module: 'drinksStore', drinkId: id }, 
      error
    )
  } finally {
    hideLoading()
  }
}
```

### PR レビューチェックリスト

PR を作成またはレビューする際は、以下を確認してください:

- [ ] コード変更が実装されている
- [ ] テストが追加/更新されている
- [ ] 仕様が変更された場合、`.agent/specs/` が更新されている
- [ ] 関連する GitHub Issues がリンクされている
- [ ] 必要に応じて `.agent/docs/` のドキュメントが更新されている

## 🤖 Copilot の動作

### 仕様更新の自動提案

仕様に影響するコード変更を検出した場合:

1. **積極的に提案**: 仕様更新を自動的に提案
2. **差分を表示**: 更新が必要な内容の差分を表示
3. **確認を求める**: 更新前に確認を求める

**提案の例**:
```
コードを変更しました。以下の仕様ファイルも更新が必要です:

.agent/specs/drinks-api.md:
- [ ] 新しい `filterByDateRange` パラメータを追加
- [ ] レスポンススキーマを更新

更新しますか?
```

### PR 作成サポート

コード変更が PR の準備ができた場合:

1. **チェック**: `.agent/specs/` の更新が必要かどうか確認
2. **PR 説明文を生成**: 以下を含める
   - 変更内容のサマリー
   - 関連する仕様へのリンク
   - レビュアー用のチェックリスト
3. **検証**: GitHub Issue のリンクを確認

### ドキュメントメンテナンス

- **自動検出**: `.agent/docs/` 内の未解決の質問が議論で解決された場合に検出
- **移動を提案**: 解決済みの項目を `.agent/specs/` に移動することを提案
- **整理**: QA リストをカテゴリ別に整理された状態に保つ

## 📌 GitHub Issues との連携

- `.agent/docs/` のタスクは GitHub Issues を参照: `#123`
- 一貫性のために GitHub Issue テンプレートを使用
- タスク完了時に Issue のステータスを更新
- PR を Issue に自動的にリンク: `Closes #123`

## 🎯 ベストプラクティス

1. **信頼できる唯一の情報源**: `.agent/specs/` は常に最新の状態に保つ
2. **「どのように」ではなく「なぜ」を記録**: 根拠とコンテキストに焦点を当てる
3. **ドキュメントは軽量に**: 情報の重複を避ける
4. **コピーせずリンク**: 可能な限り既存のドキュメントを参照
5. **バージョンコンテキスト**: トレーサビリティのために日付と Issue 番号を含める

## 🚨 よくある間違い

- ❌ 仕様を更新せずにコードを更新する
- ❌ 実装なしで仕様を作成する
- ❌ 複数のファイルに情報を重複させる
- ❌ GitHub Issues へのリンクを忘れる
- ❌ 解決済みの質問を `.agent/docs/` に無期限に残す
