# drink-counter

[![GitHub release](https://img.shields.io/github/release/KaiShoya/drink-counter.svg?style=flat-square)](https://github.com/KaiShoya/drink-counter/releases/latest)
[![CI Status](https://github.com/KaiShoya/drink-counter/workflows/CI/badge.svg)](https://github.com/KaiShoya/drink-counter/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/kaishoya/drink-counter/badge)](https://www.codefactor.io/repository/github/kaishoya/drink-counter)
[![codebeat badge](https://codebeat.co/badges/1f56fa48-87d0-4713-8b2a-0202cf98c41e)](https://codebeat.co/projects/github-com-kaishoya-drink-counter-main)
[![license:MIT](https://img.shields.io/badge/icense-MIT-brightgreen)](https://github.com/KaiShoya/drink-counter/blob/main/LICENSE.md)

アルコールを飲んだ杯数を日付別に記録するアプリ。

## Setup

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
├ pages/ # ページ置き場
├ plugins/ # プラグイン置き場
├ public/ # staticページ置き場
├ store/ # Pinia置き場
├ supabase/ # supabase関連のファイル置き場
│  ├ functions/ # Supabase Functionsファイル置き場
│  ├ migrations/ # マイグレーションファイル置き場 原則supabase db diffコマンドでファイルを作成する
│  └ seed.sql # シードデータファイル
└ utils/ # 共通で利用する関数・定数置き場
```
