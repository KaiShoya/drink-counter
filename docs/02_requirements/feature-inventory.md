# 機能・画面一覧

ステータス: 現行コードのルーティングから確認（2026-09-02）

中核となるプロダクト要件と受け入れ基準は [中核要件](core-requirements.md) を正本とする。本書はそれを実現する画面・導線の一覧である。

## 認証

- `/login`: ログイン
- `/confirm`: 認証確認

## 記録と管理

- `/`: 日々の飲酒記録
- `/drinks`: 飲み物・ラベルの一覧と管理
- `/drinks/new`, `/drinks/[id]`: ラベルの追加・編集
- `/drinks/item/new`, `/drinks/item/[id]`: 飲み物の追加・編集

## 分析と設定

- `/data/monthly`: 月次集計
- `/data/annual`: 年次集計
- `/data/total`: 全期間集計
- `/settings`: 利用者設定

## 案内

- `/about`: アプリ概要
- `/about/terms_of_service`: 利用規約

画面ごとの受け入れ条件や仕様変更は、該当機能の資料をこのディレクトリへ追加して管理する。
