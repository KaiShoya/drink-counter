# drink-counter

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
