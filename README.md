# Prism

**One content, infinite reach.**

Social media scheduler and analytics — powered by Playwright session capture. No official API keys required.

## Features

- **Multi-platform posting** — Instagram, TikTok, Twitter/X from one dashboard
- **Session-based auth** — Users login once via real browser; session stored encrypted (AES-256)
- **Human-like posting** — Randomized delays, typing simulation, safe hour enforcement
- **Analytics scraping** — Followers, engagement, and growth data scraped from native dashboards
- **Background worker** — Posts run on schedule even when the app is closed
- **Firestore** — Efficient reads with real-time listeners; stays within free tier

## Architecture

```
prism/
├── apps/
│   ├── web/        # Next.js 14 — frontend dashboard
│   └── worker/     # Node.js — Playwright background engine
└── packages/
    ├── db/         # Firestore client + shared types
    └── crypto/     # AES-256 session encryption
```

## Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js 14, Tailwind, shadcn/ui   |
| Backend  | Node.js, Playwright, playwright-extra stealth |
| Database | Firebase Firestore                |
| Auth     | Firebase Auth                     |
| Storage  | Firebase Storage (media files)    |
| Deploy   | Vercel (web) + Railway (worker)   |

## Getting Started

```bash
# Clone
git clone https://github.com/designbyfatur/prism
cd prism

# Install
bun install

# Configure
cp .env.example .env.local
# Fill in Firebase credentials + ENCRYPTION_KEY

# Run
bun run dev:web      # frontend
bun run dev:worker   # background engine
```

## Anti-bot Measures

- Random delays between every action (1.5–8 seconds)
- Human-like typing simulation
- Posts only between 06:00–01:00 (safe hours)
- Per-platform daily limits & minimum gaps

## License

MIT
