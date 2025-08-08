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

## Admin server to set puff counts

- Copy `.env.example` to `.env` and fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and set a strong `ADMIN_TOKEN`.
- Install dependencies and start the server:

```bash
npm install
npm run server
```

- Endpoint:
  - `POST /api/stats/set` with JSON body containing any of `{ chicken, motta, meat }` as non-negative integers.
  - Requires header `Authorization: Bearer <ADMIN_TOKEN>`.

- Optional client helper: use `src/api/admin.js` and set `VITE_SERVER_URL` if not `http://localhost:4000`.
