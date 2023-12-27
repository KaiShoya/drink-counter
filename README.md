# drink-counter

[![GitHub release](https://img.shields.io/github/release/KaiShoya/drink-counter.svg?style=flat-square)](https://github.com/KaiShoya/drink-counter/releases/latest)
[![CI Status](https://github.com/KaiShoya/drink-counter/workflows/CI/badge.svg)](https://github.com/KaiShoya/drink-counter/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/kaishoya/drink-counter/badge)](https://www.codefactor.io/repository/github/kaishoya/drink-counter)
[![codebeat badge](https://codebeat.co/badges/1f56fa48-87d0-4713-8b2a-0202cf98c41e)](https://codebeat.co/projects/github-com-kaishoya-drink-counter-main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5a3748d4a79343e8aad4f51783bb4dba)](https://app.codacy.com/gh/KaiShoya/drink-counter/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/aae1e79d27e18418a042/maintainability)](https://codeclimate.com/github/KaiShoya/drink-counter/maintainability)
[![license:MIT](https://img.shields.io/badge/icense-MIT-brightgreen)](https://github.com/KaiShoya/drink-counter/blob/main/LICENSE.md)

アルコールを飲んだ杯数を日付別に記録するアプリ。

## Setup

Set up a git commit template.

```bash
git config --local commit.template .commit-msg
```

Make sure to install the dependencies:

```bash
yarn install
```

Install Supabase CLI & Log in.  
https://supabase.com/docs/guides/cli

## Development Server

```bash
# Rename .env.template to .env
cp .env.template .env

# Start the Supabase service
supabase start

# Edit .env SUPABASE_KEY

# Start the development server on http://localhost:3001
yarn dev
```

## Create a migration file from local schema differences

```bash
supabase db diff -f [file_name]
```

# Release

```
yarn version --major
yarn version --minor
yarn version --patch
```

# 各階層の役割
```
├ assets/ # 資産置き場
│  └ scss/ # グローバルなSCSS置き場 フレームワークを使ってる & コンポーネント単位でCSS当ててるから使うことないかも。
├ components/ # コンポーネント置き場
│  ├ share/ # 共通で利用するコンポーネント置き場 ここに機能単位でディレクトリを分けて作成する
│  └ pages/ # ページ毎にディレクトリを分けて、そのページ内だけで利用するコンポーネントを置く
├ composables/ # Piniaで管理するほどでもないコード置き場（今の所使ってない）
├ layouts/ # レイアウト置き場
├ locales/ # 言語ファイル置き場
├ pages/ # ページ置き場 pagesの中ではエラーハンドリングしない
├ plugins/ # プラグイン置き場
├ public/ # staticページ置き場
├ store/ # Pinia置き場 モデルとそのモデルを更新するためのAPIを提供する
│  ├ data/ # Supabase側で持っているモデルとほぼ同じモデルを保持する エラーが発生した場合はメッセージコードをreturnする
│  ├ pages/ # dataのモデルを組み合わせて、各ページで利用するモデルを作成する エラーが発生した場合はメッセージをトースト表示する
│  ├ supabase.ts # supabase関連 storeが適切かは悩みどころ 
│  └ user.ts # ログイン情報を保持する
├ supabase/ # supabase関連のファイル置き場
│  ├ functions/ # Supabase Functionsファイル置き場
│  ├ migrations/ # マイグレーションファイル置き場 原則supabase db diffコマンドでファイルを作成する
│  └ seed.sql # シードデータファイル
└ utils/ # 共通で利用する関数・定数置き場
```

# ブランチ命名規則とバージョン更新規則
| ブランチ名           | Issue Label   | 概要                                                                         | 補足                                                                                   |
| :------------------- | :------------ | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| feature/#999_xxxxxx  | enhancement   | 機能追加用ブランチ                                                           | 原則マイナーバージョンを更新する。                                                     |
| bugfix/#999_xxxxxx   | bug           | 不具合修正用ブランチ                                                         | 原則パッチバージョンを更新する。                                                       |
| refactor/xxxxxx      | refactoring   | リファクタリング用ブランチ                                                   | 原則パッチバージョンを更新するが、影響範囲が大きい場合はマイナーバージョンを更新する。 |
| document/#999_xxxxxx | documentation | ドキュメントの整備用ブランチ                                                 | 原則パッチバージョンを更新する。                                                       |
| maintain/#999_xxxxxx | maintenance   | アプリとは直接関係のない機能（.vscode/や.github/、ESLint等）の整備用ブランチ | 原則パッチバージョンを更新する。                                                       |
| release/v0.0.0       |               | リリース用ブランチ                                                           | 複数のチケットをリリースする場合に利用する。                                           |

# コミットメッセージ規約
[Conventional Commits v1.0.0](https://www.conventionalcommits.org/ja/v1.0.0/) に従います。  

# リリース手順
1. PR作成
2. PRにLabel(major/minor/patch)を付与する
3. Github Actionsチェック
4. PRマージ
