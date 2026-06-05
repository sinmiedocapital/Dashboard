import Link from 'next/link'

const sections = [
  {
    id: 'overview',
    title: '1. What We Built (and Why)',
    color: '#6c5ce7',
    steps: [
      {
        label: 'The Big Picture',
        content: `This web app has two parts:
• A public landing page (/) — anyone can see it, no password needed
• A signal dashboard (/signals) — members-only, protected by a shared password

When TradingView fires an alert (buy/sell/tp hit/stop hit), it sends a tiny message to this app. The app saves it to a database (Supabase), and your dashboard shows it instantly — on any phone, tablet, or computer.`,
      },
      {
        label: 'The Tech Stack',
        content: `• Next.js — the web framework. Think of it as the engine that runs the app.
• Tailwind CSS — styling utility. Makes it look good without writing custom CSS.
• Supabase — the database. Free, works like Google Sheets but for apps.
• Vercel — the host. Puts your app on the internet for free in 2 clicks.

You don't need to understand all of these deeply. The code is already written — you just need to wire up accounts.`,
      },
    ],
  },
  {
    id: 'nextjs',
    title: '2. How to Create a Next.js App From Scratch',
    color: '#00c076',
    steps: [
      {
        label: 'Prerequisites (one-time setup)',
        content: `1. Install Node.js — go to nodejs.org → download the LTS version → install it
2. Open Terminal (Mac) or Command Prompt (Windows)
3. Type: node -v and press Enter — you should see a version number like v20.x.x
   If you do, you're ready.`,
      },
      {
        label: 'Create the App',
        content: `In Terminal, navigate to where you want the project:
  cd Desktop

Then run this one command (it does everything):
  npx create-next-app@latest my-app --typescript --tailwind --app

It asks a few questions — just press Enter to accept the defaults.

When it's done:
  cd my-app
  npm run dev

Open your browser at http://localhost:3000 and you'll see the app running.`,
      },
      {
        label: 'File Structure (the only folders that matter)',
        content: `my-app/
├── app/
│   ├── page.tsx        ← This is your homepage (what shows at /)
│   ├── layout.tsx      ← Wraps every page (fonts, global styles)
│   └── api/
│       └── webhook/
│           └── route.ts ← Receives TradingView alerts
├── components/         ← Reusable pieces (like SignalCard)
├── lib/                ← Shared code (database connection)
└── .env.local          ← Your secret keys (NEVER share this file)

To add a new page at /signals, create: app/signals/page.tsx
To add a new page at /tutorial, create: app/tutorial/page.tsx
That's it — the URL comes from the folder name.`,
      },
      {
        label: 'How Pages Work',
        content: `Every page.tsx file exports a default function that returns HTML-like code (called JSX):

  export default function MyPage() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    )
  }

The file you're reading right now is exactly this — it's just a page.tsx with text content organized into sections. No magic.`,
      },
    ],
  },
  {
    id: 'supabase',
    title: '3. Supabase — Your Database',
    color: '#fdcb6e',
    steps: [
      {
        label: 'What Supabase Does',
        content: `Supabase is like Google Sheets in the cloud, but faster and more secure. Every time TradingView fires an alert, this app writes a new row to a table called "signals." The dashboard reads those rows and shows them as cards.

It's free for small projects — you won't hit limits for a community dashboard.`,
      },
      {
        label: 'Set Up Supabase (10 minutes)',
        content: `1. Go to supabase.com → click "Start your project" → sign up with GitHub
2. Click "New project" → give it a name (e.g. "smc-signals") → choose a region (US East) → set a database password → Create project
3. Wait ~2 minutes for it to spin up
4. Go to: Project Settings → API
   You'll see two things you need:
   • Project URL (looks like: https://abcdef123.supabase.co)
   • anon public key (long string starting with eyJ...)
   • service_role key (another long string — keep this SECRET)
5. Copy all three into your .env.local file`,
      },
      {
        label: 'Create the Signals Table',
        content: `In Supabase, go to SQL Editor and paste this, then click Run:

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

That creates the table. You only do this once.`,
      },
    ],
  },
  {
    id: 'vercel',
    title: '4. Vercel — Putting It on the Internet',
    color: '#00c076',
    steps: [
      {
        label: 'What Vercel Does',
        content: `Vercel takes your code from GitHub and turns it into a live website with a URL like https://your-app.vercel.app. It rebuilds automatically every time you push code. Free tier is plenty for this.`,
      },
      {
        label: 'Deploy (5 minutes)',
        content: `1. Go to vercel.com → Sign up with GitHub
2. Click "Add New Project"
3. Find your GitHub repo (sinmiedocapital/Dashboard) → Import
4. Set the Root Directory to "web" (important — the Next.js app lives inside /web/)
5. Click "Environment Variables" — add all 5 variables:
   • NEXT_PUBLIC_SUPABASE_URL
   • NEXT_PUBLIC_SUPABASE_ANON_KEY
   • SUPABASE_SERVICE_ROLE_KEY
   • WEBHOOK_SECRET  (make up any random string, e.g. "smc-secret-2025")
   • DASHBOARD_PASSWORD  (the password you'll share with members)
6. Click Deploy → wait ~1 minute → your app is live!

Vercel gives you a URL like: https://smc-signals.vercel.app
You can also add a custom domain (e.g. signals.sinmiedocapital.com) in Vercel → Domains.`,
      },
    ],
  },
  {
    id: 'tradingview',
    title: '5. Wiring TradingView to Your App',
    color: '#ff3b5c',
    steps: [
      {
        label: 'How the Webhook Works',
        content: `The Pine Script indicator already has all the alert code built in. When the indicator fires (BUY/SELL/TP1/SL_HIT), TradingView sends a POST request to your app's /api/webhook URL. Your app receives it, checks the secret key, and saves it to Supabase.`,
      },
      {
        label: 'Set Up Alerts in TradingView',
        content: `For each signal type (buy, sell, tp1, sl_hit), create an alert:

1. In TradingView, click the Alarm Clock icon → Create Alert
2. Condition: SMC Venice [Scalper] v9 → pick the signal (e.g. "Buy Signal")
3. Notifications tab → check "Webhook URL"
4. Webhook URL: https://your-app.vercel.app/api/webhook
5. Message box — paste the JSON (the indicator already outputs this):
   {"action":"buy","symbol":"{{ticker}}","tf":"{{interval}}","entry":{{plot_0}},...}
6. In the webhook header, add: x-webhook-secret = the value you set in WEBHOOK_SECRET
   (TradingView → Alerts → Webhook URL → Headers section)

Once saved, every alert auto-fires to your dashboard.`,
      },
    ],
  },
  {
    id: 'envfile',
    title: '6. Environment Variables (.env.local)',
    color: '#6c5ce7',
    steps: [
      {
        label: 'What This File Is',
        content: `The .env.local file holds your secret keys. It NEVER gets committed to GitHub (it's in .gitignore). You have a template at web/.env.local.example — copy it to web/.env.local and fill in your real values.

This file only exists on your machine and in Vercel's settings. Think of it like your password manager for the app.`,
      },
      {
        label: 'The 5 Variables You Need',
        content: `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
  → From Supabase: Project Settings → API → Project URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  → From Supabase: Project Settings → API → anon public

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  → From Supabase: Project Settings → API → service_role (keep secret!)

WEBHOOK_SECRET=any-random-string-you-invent
  → Used to verify TradingView alerts are legitimate. Example: "smc-tv-2025"

DASHBOARD_PASSWORD=the-password-you-share-with-members
  → Example: "tradewithfear2025" — share this with your community`,
      },
    ],
  },
  {
    id: 'localdev',
    title: '7. Running It Locally (on Your Computer)',
    color: '#fdcb6e',
    steps: [
      {
        label: 'Run the Web App',
        content: `1. Open Terminal
2. cd /path/to/Dashboard/web
3. Make sure you have a .env.local file with real values
4. npm install  (first time only — installs dependencies)
5. npm run dev

Open http://localhost:3000 in your browser. The app runs locally.
The /signals page needs your Supabase to be set up — if it shows "Waiting for signals…" then everything is connected correctly.`,
      },
      {
        label: 'Run the Streamlit Dashboard (Python)',
        content: `The older Python dashboard (app.py) is separate. To run it:

1. Open Terminal
2. cd /path/to/Dashboard  (the root, not the web/ folder)
3. First time only:
   pip install -r requirements.txt
4. streamlit run app.py

It opens at http://localhost:8501.

Note: This is the internal trading tool. The web app (Next.js) is for your community. They are completely separate.`,
      },
    ],
  },
]

export default function TutorialPage() {
  return (
    <main style={{ backgroundColor: '#0d1117', minHeight: '100vh', color: '#e2e8f0' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1a1a2e' }}>
        <div>
          <span className="font-bold text-white">Sin Miedo Capital</span>
          <span className="text-slate-500 text-sm ml-2">· Dev Guide</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signals" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            Signal Dashboard
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            ← Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">
        <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5" style={{ backgroundColor: '#6c5ce722', color: '#6c5ce7' }}>
          Internal Reference
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">How to Build Web Apps Like This</h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          A plain-English guide covering every piece of this stack — Next.js, Supabase, Vercel, and TradingView webhooks.
          No prior coding experience assumed.
        </p>
      </section>

      {/* Table of Contents */}
      <section className="max-w-3xl mx-auto px-6 pb-8">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e' }}>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contents</div>
          <div className="grid grid-cols-2 gap-2">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: s.color }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-3xl mx-auto px-6 pb-20 space-y-10">
        {sections.map(section => (
          <div key={section.id} id={section.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a2a3e' }}>
            {/* Section header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: '#1a1a2e' }}>
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
              <h2 className="font-bold text-white">{section.title}</h2>
            </div>

            {/* Steps */}
            <div style={{ backgroundColor: '#13131f' }}>
              {section.steps.map((step, i) => (
                <div
                  key={step.label}
                  className="px-5 py-4"
                  style={{ borderTop: i > 0 ? '1px solid #1a1a2e' : undefined }}
                >
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: section.color }}
                  >
                    {step.label}
                  </div>
                  <pre
                    className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed"
                    style={{ fontFamily: 'inherit', margin: 0 }}
                  >
                    {step.content}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="border-t text-center py-8 text-xs text-slate-600" style={{ borderColor: '#1a1a2e' }}>
        Sin Miedo Capital · Internal Dev Reference · SMC Venice v9
      </footer>
    </main>
  )
}
