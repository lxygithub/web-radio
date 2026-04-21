<h1 align="center">Web Radio</h1>

<p align="center">
  A modern web radio player that lets you browse and listen to thousands of live radio stations from around the world.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#project-structure">Project Structure</a>
</p>

## Features

- **30,000+ Radio Stations** — Powered by the [Radio Browser API](https://www.radio-browser.info/), a free and open database of radio stations worldwide
- **Category Browsing** — Filter by Music, English Learning, News & Talk categories
- **Search** — Find stations by name, country, language, or genre
- **Star Favorites** — Bookmark your favorite stations (saved locally, synced with account when logged in)
- **Play History** — Track recently played stations
- **Sleep Timer** — Auto-pause playback after 15/30/45/60 minutes
- **Audio Visualizer** — Animated waveform display while playing
- **Dark/Light Theme** — Toggle between dark and light mode, preference saved locally
- **Bilingual** — English and Chinese interface, default matches your locale
- **Keyboard Shortcuts** — Space to pause/play, Left/Right arrows to switch stations
- **Fully Responsive** — Mobile hamburger menu, adaptive player layout

## Screenshots

> **Note:** Screenshots need to be captured manually and placed in the `screenshots/` directory.
>
> | Placeholder | How to capture |
> |-------------|----------------|
> | `screenshots/home-dark.png` | Home page in dark mode (desktop) |
> | `screenshots/home-light.png` | Home page in light mode (desktop) |
> | `screenshots/mobile.png` | Mobile view with hamburger menu |
> | `screenshots/player.png` | Bottom player with audio visualizer |
> | `screenshots/detail.png` | Station detail panel |
> | `screenshots/search.png` | Search page results |

### Dark Mode

![Dark Mode](screenshots/home-dark.png)

### Light Mode

![Light Mode](screenshots/home-light.png)

### Mobile View

![Mobile View](screenshots/mobile.png)

### Player

![Player](screenshots/player.png)

### Station Detail

![Station Detail](screenshots/detail.png)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16** (App Router) |
| Language | **TypeScript** |
| Styling | **TailwindCSS v4** + CSS Custom Properties |
| Audio | **HTML5 Audio API** + Custom UI |
| Data Source | **Radio Browser API** (free, 30k+ stations, no API key) |
| Database | **Cloudflare D1** (SQLite) — for user accounts, favorites, history |
| Auth | **JWT + HttpOnly Cookie** with bcrypt password hashing |
| Deployment | **Cloudflare Pages + Workers + D1** |

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, yarn, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lxygithub/web-radio.git
cd web-radio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Pause / Play |
| `←` | Previous station in list |
| `→` | Next station in list |

## Project Structure

```
web-radio/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (sidebar + player)
│   ├── page.tsx                  # Home page (browse stations)
│   ├── search/                   # Search page
│   ├── favorites/                # Favorites page
│   ├── history/                  # Play history page
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   └── api/                      # API routes (auth, user data)
├── components/
│   ├── Player.tsx                # Fixed bottom audio player
│   ├── StationCard.tsx           # Station card component
│   ├── StationList.tsx           # Station list (grid/list view)
│   ├── StationDetail.tsx         # Station detail panel
│   ├── CategoryNav.tsx           # Category navigation tabs
│   ├── SearchBar.tsx             # Search bar
│   ├── Sidebar.tsx               # Left sidebar navigation
│   ├── TopBar.tsx                # Mobile top bar with hamburger menu
│   ├── AudioVisualizer.tsx       # Canvas-based audio waveform
│   ├── SleepTimer.tsx            # Sleep timer with countdown
│   └── Providers.tsx             # App providers (theme, language, auth, audio)
├── context/
│   ├── AudioContext.tsx          # Global audio playback state
│   ├── AuthContext.tsx           # Authentication state
│   ├── LanguageContext.tsx       # i18n (EN/ZH) state
│   └── ThemeContext.tsx          # Dark/Light theme state
├── lib/
│   ├── radio-browser.ts          # Radio Browser API client
│   ├── auth.ts                   # JWT auth helpers
│   ├── db.ts                     # D1 database operations
│   ├── local-storage.ts          # LocalStorage helpers (favorites, history)
│   └── i18n/
│       └── translations.ts       # EN/ZH translation strings
├── types/
│   └── station.ts                # TypeScript type definitions
├── styles/
│   └── globals.css               # Global styles + theme variables
├── wrangler.toml                 # Cloudflare Workers configuration
└── migrations/                   # D1 database migrations
```

## Deployment

### Cloudflare Pages + Workers

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Create a D1 database:
```bash
wrangler d1 create web-radio
```

4. Update `wrangler.toml` with the `database_id` from the previous step.

5. Run database migrations:
```bash
wrangler d1 migrations apply web-radio
```

6. Deploy:
```bash
npx wrangler deploy
```

> The free Cloudflare tier provides sufficient quota for personal use.

### Local Server (Future Migration)

The project is designed for easy migration to a self-hosted server:

- Database interface in `lib/db.ts` is abstracted — swap D1 for SQLite/MySQL/PostgreSQL
- Radio Browser API calls can be replaced with a custom station source
- API routes use standard Next.js App Router — no Cloudflare-specific code

## License

MIT
