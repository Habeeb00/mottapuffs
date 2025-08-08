# Puffs Meter - Client

Minimal React app wired to Supabase. UI is intentionally basic.

## Setup

1. Create a `.env` file in `client/` with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Ensure the database schema and trigger from your Supabase SQL are applied.

## Develop

```
npm install
npm run dev
```

Open the app, register/login, add puffs, see leaderboard.
