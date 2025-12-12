# ❓ QA リスト — インデックス

**最終更新**: 2025-12-12  
**ステータス**: Active  
**関連**: tasks.md, agent-documentation-workflow.md（運用ルール参照）

このファイルはリリース時にのみ更新される統一インデックスです。開発中は `qa/vX.Y-qa.md` を随時更新してください。

---

## アクティブなバージョン

### v1.20（開発中）
- **ファイル**: [qa/v1.20-qa.md](qa/v1.20-qa.md)
- **最終更新**: 2025-12-12
- **ステータス**: Active 🔵
- **テーマ**: UX対応 + メイン機能補強に関する Q&A

## プランド バージョン

### v1.21（次点）
- **ファイル**: [qa/v1.21-qa.md](qa/v1.21-qa.md)
- **ステータス**: Planned
- **テーマ**: ラベル機能実装に関する Q&A

### v1.22（TBD）
- **ファイル**: [qa/v1.22-qa.md](qa/v1.22-qa.md)
- **ステータス**: TBD

## 汎用 & 長期 Q&A

### 未決定事項（バージョン非依存）
- **ファイル**: [qa/qa-backlog.md](qa/qa-backlog.md)
- **内容**: 長期検討事項、v2.0 関連の Q&A、セキュリティ・パフォーマンス未決定事項

## 完了済みバージョン

完了済みバージョンの Q&A は [`qa-archive/`](qa-archive/) を参照してください。

---

## QA 運用ルール

### 開発中
1. 新規 QA 発生時は、対応バージョンの `qa/vX.Y-qa.md` へ記載
2. 形式: `## [Category] Issue #XXX: Question Title`
   ```markdown
   ## [Architecture] Issue #291: ダークモード実装の自動化について
   
   **Question**: ...
   **Answer**: ...
   **Decided on**: 2025-12-12
   **Related**: #291
   ```
3. 複数バージョンに跨る場合 → v1.20 に記載し、他から参照リンク
4. GitHub Issues のコメントでの議論と連携

### リリース時
1. 該当バージョンの `qa/vX.Y-qa.md` を確定
2. 完了済み Q&A を `qa-archive/vX.Y-qa.md` へ移動（オプション）
3. このファイル（`qa-index.md`）を更新
4. 決定済み QA は `.agent/specs/` に統合

---

## 参照
- [agent-documentation-workflow.md](../../.github/agent-documentation-workflow.md) — 詳細な運用ルール
