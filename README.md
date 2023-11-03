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
