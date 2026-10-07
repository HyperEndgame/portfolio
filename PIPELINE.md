# PIPELINE — portfolio (Minecraft-themed)

Repo: https://github.com/HyperEndgame/portfolio · branch `testing` · served at zectron.net/portfolio
Graphify: none yet.

## Structure
- `vite.config.js` — base `/portfolio/`, `vite preview` serves prod (Railway, `npm start`).
- `src/App.jsx` — state: slot 1-9, sound, mobile drawer, vitals collapse, game, amulet, toast. Keys 1-9 / M / Esc.
- `src/data.js` — ALL content (bio, skills, projects, journey, advancements, trades, biome per slot).
- `src/icons.js` — original pixel maps; `components/Pixel.jsx` renders them as SVG.
- `src/sound.js` — Web Audio synth (click, hover, hit, break, pop, levelup); pref in localStorage.
- `components/Biome.jsx` — procedural SVG scenes per biome. `Particles.jsx` — canvas fx per biome.
- `components/Hud.jsx` — top-left info + clock, sound toggle, hearts/hunger/XP + hotbar.
- `components/Screens.jsx` — content per slot. `Game.jsx` — Mine for the Amulet. `Player.jsx` — placeholder avatar (`src`/`children` to replace). `Tip.jsx` — tooltip.
- Zectron (`claude_projects/zectron/next.config.ts`) rewrites `/portfolio/*` → this Railway service.

## Feature 1: initial build (2026-10-07)
**Opus plan:** Vite+React+Tailwind+Framer+lucide. 9 slots → screens + biomes. Original pixel assets only (no Mojang textures). Procedural SVG biomes, canvas particles, synth audio. Mobile: panel → full-screen drawer, hotbar above it, vitals collapsible. Separate Railway service, Next rewrite from zectron.
**Sonnet/Opus code:** all files above. Verified desktop + mobile in browser, no console errors.
**Haiku findings:** (pending)
