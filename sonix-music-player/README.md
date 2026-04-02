# SONIX — Music Player Web App

A multi-page music player interface built with pure HTML, CSS, and JavaScript. Zero dependencies, zero frameworks — just clean, fast, beautiful code.

## Pages

| Page | File | Route |
|------|------|--------|
| 🎵 Player | `index.html` | `/` |
| ≡ Queue | `queue.html` | `/queue` |
| ◈ Playlists | `playlist.html` | `/playlist` |
| ◉ Profile | `userdata.html` | `/userdata` |
| ◎ Discover | `recommendations.html` | `/recommendations` |

## Project Structure

```
sonix/
├── index.html              # Main player page
├── queue.html              # Queue management
├── playlist.html           # Playlist browser & detail
├── userdata.html           # User profile & statistics
├── recommendations.html    # Genre-based discovery
├── vercel.json             # Vercel deployment config
├── styles/
│   ├── global.css          # Shared layout, sidebar, variables
│   ├── player.css          # Player page styles
│   └── pages.css           # All other page styles
└── scripts/
    ├── data.js             # Shared data, state, track library
    └── player.js           # Player logic & audio visualizer
```

## Features

- 🎨 **Dark aesthetic** with lime-yellow accent system
- 💿 **Animated spinning vinyl** disk while playing
- 📊 **Audio visualizer** bar animation at the bottom
- ⚡ **Persistent state** via localStorage (track, progress, volume)
- 🔀 Shuffle & repeat modes
- ❤️ Like / unlike tracks
- 📋 Create and manage playlists
- 🎯 Genre-based recommendations with match % scoring
- 📈 User stats: listening heatmap, genre breakdown, top artists
- ✅ Clean URL routing via `vercel.json`

## Deploy to Vercel from GitHub

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. **No configuration needed** — Vercel auto-detects static files
5. Click **Deploy** ✓

The `vercel.json` handles:
- Clean URL routing (`/queue` → `queue.html`)  
- Security headers
- Long-term CSS/JS caching

## Local Development

No build step needed. Just open `index.html` in any browser, or serve with:

```bash
npx serve .
# or
python3 -m http.server 3000
```

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, flexbox, animations
- **Vanilla JS** — no frameworks, no bundler
- **Google Fonts** — Syne (display) + DM Mono (monospace)
- **localStorage** — cross-page state persistence
