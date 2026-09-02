# データモデルと変更運用

ステータス: 要詳細検証。現行 migration 名と旧データモデル仕様から再編（2026-09-02）

## 主なデータ

- `auth.users`: Supabase Auth の利用者。
- `public.user_settings`: 日付切替時刻やタイムゾーンなど、利用者ごとの設定。
- `public.drink_labels`: 飲み物を分類するラベル。
- `public.drinks`: 記録対象の飲み物。
- `public.drink_counters`: 日付ごとの飲酒カウント。

`app/types/database.types.ts` は Supabase schema から生成する型であり、Repository の入出力はこの型と整合させる。

## 変更手順

1. 既存の migration とデータ整合性を確認する。
2. 新しい migration を `supabase/migrations/` に追加する。適用済み migration は編集しない。
3. ローカル環境で migration を適用し、必要に応じて `app/types/database.types.ts` を再生成する。
4. RLS、外部キー、既存データへの影響、ロールバック方法を確認する。
5. 変更した仕様とテストを同じ変更に含める。

ラベル削除時の参照整合性は未確定であり、`05_discussions/open-questions.md` の T-0035 を先に解決する。
