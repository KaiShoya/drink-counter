# drink-counter

[![CI Status](https://github.com/KaiShoya/drink-counter/workflows/CI/badge.svg)](https://github.com/KaiShoya/drink-counter/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/kaishoya/drink-counter/badge)](https://www.codefactor.io/repository/github/kaishoya/drink-counter)
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
