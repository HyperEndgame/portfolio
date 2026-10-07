# Rohtak Harith — Minecraft Portfolio

Minecraft-themed personal portfolio. Live at **[zectron.net/portfolio](https://zectron.net/portfolio)**.

## Stack
React 18 · Vite 5 · Tailwind · Framer Motion (LazyMotion) · Canvas particles · Web Audio (synth SFX + generative piano)

## Run
```bash
npm install
npm run dev      # http://localhost:5173/portfolio/
npm run build
npm start        # vite preview on $PORT
```

## Controls
`1`–`9` / hotbar / swipe: switch screens · arrows: next/prev · `Esc`: menu · `M`: mute · `F3`: debug

## Layout
- `src/data.js`: all content (profile, projects, journey, links, biomes)
- `src/App.jsx`: screen routing, input hooks, layout
- `src/components/`: Background, Ambience, Particles, Player, Hud, Screens, Tooltip
- `src/sound.js`: UI sounds + ambient music
- `scripts/icons.py`: generates pixel icons into `src/icons.js`
- `public/img/`: biome photos (webp, 1920 + 1280) and character renders

## Deploy
Railway (nixpacks, `railway.toml`) from branch `testing`. The Zectron Next.js site rewrites `/portfolio/*` to this service.

Font: [Monocraft](https://github.com/IdreesInc/Monocraft) (OFL).
