# drink-counter ドキュメント

このディレクトリは drink-counter の企画・要件・仕様・運用の正本です。コードを変更するときは、関連資料も同じ変更で更新します。

```text
00_templates/    新規資料のテンプレート
01_product/      プロダクト概要・用語・利用者価値
02_requirements/ 機能・非機能要件と受け入れ条件
03_spec/         アーキテクチャ、データ、API、画面・実装仕様
04_decisions/    決定記録（ADR）
05_discussions/  未解決事項・調査・検討
06_execution/    実装計画、タスク、QA、リリース・運用
99_archive/      旧資料。現行仕様の根拠には使わない
```

## 運用

- 現行資料は番号付きディレクトリに置く。過去資料を更新する必要がある場合も、まず現行資料として再整理できないか検討する。
- 仕様を決めたら `04_decisions/` に背景・決定・理由・却下案を残し、`02_requirements/` または `03_spec/` に結果を反映する。
- 実装に着手する内容は受け入れ条件とともに `06_execution/` に記録する。QA結果やリリース手順も同じ場所で管理する。
- `99_archive/2026-09-legacy-agent-workspace/` は `.agent/`、`.gemini/`、`.github/` の旧エージェント資料と旧 `docs` submodule 設定を移した履歴です。
