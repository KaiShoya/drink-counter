# GitHub Copilot Instructions

These instructions define how GitHub Copilot should assist with this TypeScript project. The goal is to ensure consistent, high-quality code generation aligned with TypeScript conventions, modern tooling, and our architecture standards.

## 🧠 Context

- **Project Type**: Frontend UI
- **Language**: TypeScript
- **Framework / Libraries**: Vue.js / Nuxt.js / Pinia
- **Architecture**: BCD Design / Clean Architecture

## 🔧 General Guidelines

- Use idiomatic TypeScript—always prefer type safety and inference.
- Use `interface` or `type` aliases to define data structures.
- Always enable `strict` mode and follow the project's `tsconfig.json`.
- Prefer named functions, especially for reuse and testability.
- Use `async/await` over raw Promises and avoid `.then().catch()` chains.
- Keep files small, focused, and well-organized.

## 🧶 Patterns

### ✅ Patterns to Follow

- Use Dependency Injection and Repository Pattern where applicable.
- For APIs, include:
  - Input validation with Joi / express-validator
  - Error handling using custom error classes / status codes / try-catch blocks
  - Logging via Winston or console in dev mode
- For UI:
  - Components should be pure and reusable
Avoid inline styling; use Tailwind / CSS Modules / styled-components

### 🚫 Patterns to Avoid

- Don’t generate code without tests.
- Don’t hardcode values; use config/env files.
- Avoid global state unless absolutely necessary.
- Don’t expose secrets or keys.

## 🧪 Testing Guidelines

- Use `@nuxt/test-utils`, `Vitest`, `@pinia/testing` for unit and integration tests.
- Prefer test-driven development (TDD) when modifying core logic.
- Include mocks/stubs for third-party services.

# パターンとベストプラクティス

- 関数型プログラミングの原則（不変性、純粋関数、制御不能な副作用の回避）を徹底する。
- 状態管理はローカルには useState、グローバルには Pinia を使う。
- Supabase との通信は副作用として切り出し、型安全性を担保する。
- UI コンポーネントは再利用性を意識し、props と emits でデータフローを明確にする。
- i18n（@nuxtjs/i18n）は必ず利用し、テキストは直接埋め込まずロケールファイル経由で管理する。
- アイコンは @nuxt/icon、@iconify-json/mdi を利用する。
- Google Analytics 連携は nuxt-gtag を使い、環境変数で有効/無効を切り替える。
- スタイルは Bulma, animate.css を利用し、SCSS でカスタマイズする。

# コーディングスタイルとドキュメント

- 「どのように」ではなく「なぜ」についてコメントし、インターフェース・型・複雑な関数は JSDoc/TSDoc でドキュメント化する。
- コミットは Conventional Commits（feat, fix, chore, docs, refactor など）に従う。
- 型安全性を重視し、TypeScript の型定義を徹底する。
- ルートやAPI通信の定義は utils ディレクトリで一元管理する。
- i18n のキーは utils/locales.ts で定数化し、直接文字列を使わない。

# その他

- Nuxt 4（RC）を利用し、公式の推奨構成・設定を優先する。
- コミットはConventional Commits（feat、fix、chore、docs、refactor等）に従って構造化する。
- 依存パッケージのバージョンアップ時は breaking change に注意し、必要に応じてマイグレーションガイドを参照する。
