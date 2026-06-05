# Sin Miedo Capital — Signal Dashboard

Live signal dashboard for the SMC Venice v9 indicator community. Signals from TradingView appear instantly on any device.

## Quick Setup

### 1. Supabase (database)

1. Go to [supabase.com](https://supabase.com) → create a free account → New Project
2. In the SQL Editor, run this to create the signals table:

```sql
create table signals (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  action     text,
  symbol     text,
  tf         text,
  entry      numeric,
  sl         numeric,
  tp1        numeric,
  tp2        numeric,
  zone       text,
  candle     text,
  result     text
);
```

3. Go to Project Settings → API → copy your **Project URL**, **anon key**, and **service_role key**

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role |
| `WEBHOOK_SECRET` | Make up any random string — also set in TradingView alert headers |
| `DASHBOARD_PASSWORD` | Any password — share this with your community members |

### 3. Run Locally

```bash
npm install
npm run dev
```

App runs at http://localhost:3000

### 4. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Import from GitHub → select `sinmiedocapital/Dashboard`
2. Set **Root Directory** to `web`
3. Add all 5 environment variables under Project Settings → Environment Variables
4. Deploy → your live URL will be `https://your-app.vercel.app`

### 5. TradingView Webhook

In TradingView, create an alert for each signal type and set the Webhook URL to:

```
https://your-app.vercel.app/api/webhook
```

Add the header: `x-webhook-secret: your-WEBHOOK_SECRET-value`

The indicator already outputs the correct JSON payload — no changes needed to the Pine Script.

---

## Pages

| URL | Description |
|---|---|
| `/` | Public landing page — share with community |
| `/signals` | Live signal dashboard (password protected) |
| `/tutorial` | Dev guide — how this app was built |

## Need Help?

Open the `/tutorial` page in the app — it has step-by-step instructions for everything above in plain English.
