# Ledger

Private monthly money tracker: add earnings and expenses, see this month’s totals, and watch them on charts. Sign-in is a single owner login — there is no public sign-up.

## Login (no sign-up)

| | |
| --- | --- |
| Email | `tanmoy@ledger.app` |
| Password | `Moon92#Ledger!` |

Change `AUTH_EMAIL` and `AUTH_PASSWORD` in Vercel (and locally in `.env`) if you want different credentials. Anyone with that pair can see and edit your ledger.

## What it does

- Add earning or expense with amount, category, date, and note
- Month switcher so you can see **how much you earned and spent in that month**
- Cards for earned, spent, and leftover
- Daily bar chart, expense category pie, six-month trend
- Edit and delete entries
- Data lives in PostgreSQL (Neon on Vercel, or Postgres on your machine)

Amounts are shown in US dollars (`USD`).

## GitHub

This project is meant to live on GitHub so Vercel can deploy from it. In Cursor, create the GitHub repository from the **Create repo** control, then Vercel can import that repo.

## Live database + live Vercel URL

The app is built for **Vercel + Neon Postgres**. I cannot attach your personal Vercel or Neon accounts from this environment, so the public `*.vercel.app` URL appears after you import the GitHub repo once.

### 1. Create a Neon database (free)

1. Open [https://console.neon.tech](https://console.neon.tech) and create a project named `ledger`.
2. Copy the connection string (pooled is fine for this app).

### 2. Deploy on Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Add these environment variables:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon connection string (`sslmode=require`) |
| `AUTH_EMAIL` | `tanmoy@ledger.app` |
| `AUTH_PASSWORD` | `Moon92#Ledger!` |
| `SESSION_SECRET` | a long random string (32+ characters) |
| `NEXT_PUBLIC_CURRENCY` | `USD` |
| `NEXT_PUBLIC_LOCALE` | `en-US` |

3. Deploy. The first production build runs `prisma migrate deploy` and creates the `Transaction` table.

Your live link is the Vercel domain shown after deploy, for example `https://ledger-xxxx.vercel.app`.

## Run locally

You need Node 20+ and PostgreSQL.

```bash
cp .env.example .env
# set DATABASE_URL to your Postgres URL
npm install
npx prisma migrate deploy
npm run dev
```

Then open http://127.0.0.1:43147 and sign in with the email and password above.

If you use Docker for Postgres:

```bash
docker compose up -d
```

The bundled local URL in `.env.example` is:

`postgresql://ledger:ledger_local_dev@127.0.0.1:5432/ledger`

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port 43147 |
| `npm run build` | Generate Prisma client, apply migrations, production build |
| `npm run lint` | ESLint |
