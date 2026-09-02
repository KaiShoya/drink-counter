# ❓ QA バックログ & 長期検討事項

**最終更新**: 2025-12-12  
**ステータス**: Backlog  
**用途**: バージョン非依存の長期検討事項、v2.0 関連 Q&A  
**関連**: qa-index.md, agent-documentation-workflow.md

---

## [API・通信] リトライロジック

**Question**: Supabase API 呼び出しでタイムアウトやネットワークエラーが発生した場合、リトライ？即座にエラー表示？

**Answer**: 未決定 → `.agent/specs/api-communication.md` で仕様化予定

**Priority**: 中  
**Impact**: すべてのリポジトリメソッド

---

## [API・通信] キャッシング戦略

**Question**: 月次集計データなど、頻繁には変わらないデータはクライアント側でキャッシュすべき？

**Answer**: 未決定 → パフォーマンス検証後に `.agent/specs/state-management.md` に追記

**Priority**: 低  
**Implementation Timeline**: v2.0 計画時

---

## [テスト] テストカバレッジ目標

**Question**: ユニットテスト・統合テスト・E2E テストの目標カバレッジは？

**Answer**: 未決定 → `.agent/specs/testing-strategy.md` で定義予定  
- Proposal: ユニット 80%、統合 50%、E2E 主要フロー 100%

**Priority**: 高  
**Implementation Timeline**: v1.5 計画

---

## [テスト] Vitest vs Playwright

**Question**: E2E テストツールは Playwright, Cypress, Nightwatch のどれを採用？

**Answer**: 未決定 → 各ツール検証後に決定  
- Recommended: Playwright（Nuxt コミュニティで人気）

**Priority**: 中  
**Verification Owner**: TBD

---

## [国際化] 多言語対応の今後

**Question**: 現在 ja/en の2言語だが、今後追加予定は？

**Answer**: 当面は ja/en の2言語に絞る。他言語対応は今のところ予定なし。

**Decided on**: 2025-12-10（確定）  
**Related**: copilot-instructions.md

---

## [セキュリティ] RLS ポリシーの監査

**Question**: RLS ポリシーの完全性検証は十分か？

**Answer**: 未決定 → セキュリティ監査 Issue を作成予定

**Priority**: 高  
**Impact**: ユーザーデータの隔離  
**Related**: data-model.md

---

## [セキュリティ] シークレット管理

**Question**: Vercel/GitHub Secrets の定期ローテーション戦略は必要？

**Answer**: 未決定 → セキュリティポリシー策定予定

**Priority**: 中  
**Implementation Timeline**: CI/CD パイプライン改善時

---

## [セキュリティ] CSRF 対策

**Question**: Nuxt のビルトイン CSRF 保護が十分か？

**Answer**: 要確認 → Nuxt セキュリティガイド確認予定

**Priority**: 低  
**Reference**: Nuxt セキュリティガイド

---

## [パフォーマンス] バンドルサイズ最適化

**Question**: 現在のバンドルサイズはどのレベル？削減目標は？

**Answer**: 測定予定 → パフォーマンス基準値を測定

**Target**: LCP < 2.5s, FID < 100ms  
**Verification Tools**: Web Vitals, Lighthouse  
**Priority**: 中

---

## [パフォーマンス] 画像最適化

**Question**: アバター画像などの WebP 化は必要？

**Answer**: 未決定 → パフォーマンス測定後に判断

**Priority**: 低  
**Impact**: ネットワーク帯域幅

---

## [パフォーマンス] 大規模データの遅延ロード

**Question**: 月次グラフなど大規模データセットの遅延ロード戦略は？

**Answer**: 検討中 → パフォーマンス要件に基づいて決定

**Priority**: 中  
**Impact**: ページロード速度  
**Related**: features.md

---

## [ビルド・デプロイ] ビルド時間短縮

**Question**: 現在のビルド時間は？< 1 分を目指す？

**Answer**: 測定予定 → 最適化計画を策定

**Target**: < 1 分  
**Priority**: 中

---

## [ビルド・デプロイ] プレビュー環境の活用

**Question**: Vercel Preview Deployment を有効化すべき？

**Answer**: 検討中 → PR レビュー効率化の観点から判断

**Priority**: 低  
**Impact**: 開発効率

---

## [ビルド・デプロイ] 環境別設定の自動化

**Question**: 開発/ステージング/本番の設定管理をどう一元化する？

**Answer**: 未決定 → 環境別設定戦略を策定予定

**Priority**: 中  
**Impact**: デプロイメント安全性

---

## v2.0 検討事項

### 次世代アーキテクチャ

**Question**: v2.0 では大規模リファクタリングを計画？

**Answer**: TBD

**Considerations**:
- Composition API 活用の深化
- 高度なキャッシング戦略
- 大規模データ操作の最適化
- マルチテナント対応の可能性

---

### 新機能の計画

**Question**: v2.0 で追加予定の大型機能は？

**Answer**: TBD（v1.21 完了時に検討開始）

**Candidates**:
- グループシェア機能
- 目標管理機能
- SNS シェア機能
- 詳細分析ダッシュボード

---

## アクションアイテム（優先度順）

1. **API 通信仕様書作成** - 期限: 2025-12-17
2. **セキュリティ監査計画** - 期限: 2025-12-15
3. **パフォーマンス基準値測定** - 期限: 2025-12-15
4. **テスト戦略の策定** - 期限: 2025-12-20

---

## Notes

- GitHub Issues で具体的な検討・決定が進むたびに、該当バージョン QA に移行
- 定期レビュー: 3ヶ月ごと
- 決定済み内容は `.agent/specs/` に統合
