# 📋 タスク一覧 — インデックス

このファイルはリリース時にのみ更新される統一インデックスです。開発中は `tasks/vX.Y-tasks.md` を随時更新してください。

## アクティブなバージョン

### v1.20（開発中）
- **ファイル**: [tasks/v1.20-tasks.md](tasks/v1.20-tasks.md)
- **最終更新**: 2025-12-10
- **ステータス**: Active 🔵
- **テーマ**: UX対応 + メイン機能補強

## プランド バージョン

### v1.21（次点）
- **ファイル**: [tasks/v1.21-tasks.md](tasks/v1.21-tasks.md)
- **ステータス**: Planned
- **テーマ**: ラベル機能の完全実装と管理

### v1.22（TBD）
- **ファイル**: [tasks/v1.22-tasks.md](tasks/v1.22-tasks.md)
- **ステータス**: TBD
- **テーマ**: 未定（v1.21 完了時点で決定）

## バックログ & 長期計画

対応バージョンが未決定のタスクと v2.0 の将来計画：
- **ファイル**: [backlog-tasks.md](backlog-tasks.md)
- **内容**: v2.0 の候補、長期検討事項、Issue統計

## 完了済みバージョン

完了済みのバージョンは [`task-archive/`](task-archive/) を参照してください。

---

## タスク運用ルール

### 開発中
1. 新規タスク追加時は、`tasks/v[X.Y]-tasks.md` へ記載（マイナーバージョン単位）
2. フィールド: `title`, `area`, `owner`（オプション）, `created`, `status`
3. ステータス: `- [ ]`（未着手） / `- [x]`（完了）
4. 完了時に追加: `completed`, `pr` URL, `commit` SHA

### リリース時
1. `tasks/v[X.Y]-tasks.md` を完全版として確定
2. 完了済みタスクを `task-archive/v[X.Y]-tasks-completed.md` へ移動（オプション）
3. このファイル（`tasks.md`）を更新
4. Git タグ作成: `git tag vX.Y.0`
5. Release Notes 作成

## 参照
- [QA_AND_DECISIONS.md](QA_AND_DECISIONS.md) — Q&A と設計決定ログ
- [agent-documentation-workflow.md](../../.github/agent-documentation-workflow.md) — 詳細な運用ルール
