# API・ネットワーク通信仕様

**最終更新**: 2025-12-13  
**対象**: Nuxt 4 / Supabase / Repository Pattern  
**関連**: `.agent/specs/repository-api.md`, `.agent/specs/state-management.md`, `app/repositories/`, `app/utils/customError.ts`, `app/plugins/repositories.ts`

## 目的
- クライアントからのデータアクセスを統一し、再現性のあるエラー処理・ロギング・リトライ・キャッシュ戦略を定義する。
- Repository Pattern を前提とした層別責務に沿って、API通信の規約を明文化する。

## 層の責務（再確認）
- Repository（`app/repositories/` 配下・`repositories.ts`経由）
  - Supabase SDK 呼び出しを一元化。
  - Supabase エラーを `CustomError` に変換して throw。
  - 成功時は型安全なデータを返却。
- Data Store（`store/data/`）
  - Repository を直接呼び出す。
  - 例外はそのまま再 throw（UI通知なし）。
- Page Store（`store/pages/`）
  - Data Store を統合し、UI状態・ローディング・トーストとログを管理。
  - `CustomError` を受け取り、ユーザー通知（toast）と `logger.error()` を実施。
- Component（`app/components/`）
  - Page Store のアクションを呼び出すのみ。直接の API 呼び出しやエラー処理は行わない。

## 通信規約
- ライブラリ: Supabase JavaScript SDK（DB/APIアクセス）。
- パラメータ: 型定義は `app/types/database.types.ts` に準拠。Repository 層で入出力の型を厳密化。
- タイムアウト: ネットワーク系はブラウザ依存だが、長期待ち回避のため `Promise.race` ベースのタイムアウトユーティリティ導入を推奨（将来拡張）。
- リトライ: 失敗時の自動リトライはデフォルト無効。明確な一過性エラー（ネットワーク切断等）にのみ指数バックオフを適用（将来拡張）。
- キャッシュ: Nuxt の `useAsyncData`/`useFetch` のキャッシュはページ単位で利用可能。Repository 層では原則キャッシュしない。オフライン対応（#292）検討時に IndexedDB へ拡張。

## エラー処理
- Supabase SDK からのエラーは Repository 層で捕捉し、`CustomError` に変換して throw。
- `CustomError` のメッセージは開発者向け（英語）とし、Page Store でユーザー通知文言（i18nキー）に変換。
- 例外ハンドリングのルールは `.agent/specs/state-management.md` の「Error Handling Layer Diagram」に準拠。

### CustomError の仕様
- 配置: `app/utils/customError.ts`
- フィールド例: `code`（識別子）、`message`（開発者向け）、`meta`（任意）
- 生成規約: Repository 層で Supabase エラー `error.code` / HTTP ステータス相当を `code` にマッピング。

## ロギング
- Page Store で `logger.error()` を呼び出し、モジュール名やコンテキスト（引数・対象ID）を付与。
- ログユーティリティ: `app/utils/logging.ts` / `app/utils/logging/`
- 開発環境では console、運用環境では将来的に送信（SaaS連携）を検討。

## トースト通知
- Page Storeのみで実施。`showSuccessToast` / `showInfoToast` / `showWarningToast` / `showDangerToast` を使用。
- 文言は必ず i18n 経由。キーは `utils/locales.ts` の定数を使用。

## API呼び出しのテンプレート（Repository 層）

```ts
// DrinksRepository の例（概略）
export async function fetchDrinks(params: FetchDrinksParams): Promise<Drink[]> {
  try {
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      // 条件は params から安全に適用

    if (error) {
      throw new CustomError('DRINKS_FETCH_FAILED', error.message, { cause: error })
    }
    return data as Drink[]
  } catch (e) {
    if (e instanceof CustomError) throw e
    throw new CustomError('DRINKS_FETCH_UNEXPECTED', 'Unexpected error during drinks fetch', { cause: e })
  }
}
```

## ネットワークポリシー（将来拡張）
- タイムアウト既定値: 10s（UIのローディング設計と合わせる）
- リトライ方針: `429/503` など一過性の可能性が高い場合のみ最大 3 回、指数バックオフ。
- オフライン検知: `navigator.onLine` と `online/offline` イベントで UI 表示切替。書き込みはキューイング（将来）。

## セキュリティ
- 認可・RLS: Supabase の RLS を前提。クライアント側はユーザーコンテキスト付の CRUD のみ許可。
- 機密データ: クライアントに秘匿すべきキーは保持しない。環境変数は Nuxt 公開変数規約に準拠。

## i18n との連携
- 例外のユーザー通知文言は i18n キーで管理。`utils/locales.ts` にキー定数を追加・参照。

## 変更手順（運用）
1. Repository 追加・変更時は本仕様と `.agent/specs/repository-api.md` を更新。
2. Page Store のエラーフロー変更時は `.agent/specs/state-management.md` と本仕様を更新。
3. 変更を含む PR では、仕様更新を必須チェック項目に含める。
