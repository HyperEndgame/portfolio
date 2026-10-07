# PIPELINE — portfolio (Minecraft-themed)

Repo: https://github.com/HyperEndgame/portfolio · branch `testing` · served at zectron.net/portfolio
Graphify: none yet.

## Structure
- `vite.config.js` — base `/portfolio/`; prod served by `vite preview` (Railway `npm start`).
- `src/App.jsx` — slot state, LAYOUT per slot (panel side, player view), keys (1-9, ←/→, Esc, M, F3), wheel cycling, XP/toast progress.
- `src/data.js` — ALL content (LinkedIn-sourced) + biome per slot (photo, crop, filter, particle fx).
- `public/img/` — user-supplied biome photos (webp) + player front/back cutouts (rembg).
- `scripts/icons.py` → generates `src/icons.js` (original 16x16 pixel icons). `components/Pixel.jsx` renders them.
- `components/Background.jsx` crossfade + Ken Burns + parallax + rays. `Particles.jsx` canvas fx. `Player.jsx` avatar.
- `components/Hud.jsx` info, F3 debug, sound, vitals/XP/hotbar, toast. `Tooltip.jsx` cursor tooltip. `Screens.jsx` 9 screens.
- Font: Monocraft (OFL) in `src/assets/fonts`.
- Zectron (`claude_projects/zectron/next.config.ts`) rewrites `/portfolio/*` → Railway service portfolio-production-7224.

## Feature 1: initial build (2026-10-07)
**Opus plan:** Vite+React+Tailwind+Framer+lucide. 9 slots → screens + biomes. Original pixel assets only (no Mojang textures). Procedural SVG biomes, canvas particles, synth audio. Mobile: panel → full-screen drawer, hotbar above it, vitals collapsible. Separate Railway service, Next rewrite from zectron.
**Sonnet/Opus code:** all files above. Verified desktop + mobile in browser, no console errors.
**Haiku findings:** None breaking. All imports/exports correct, pixel maps consistent, React patterns sound, event listeners cleaned up, mobile layout correct, keyboard handlers filter input properly.

## Feature 2: full redesign to match reference (2026-10-07)
**Plan (Opus):** User rejected v1 (procedural SVG looked nothing like the reference). Rebuild against the reference screenshots: user's own photo backgrounds, user's character render (front/back cutouts), translucent dark GUI panels w/ bordered rows, MC button, hotbar w/ sliding white selector, hearts/hunger/XP that rises per new screen, advancement toasts, cursor tooltips, F3 overlay, written-book contact, centered End screen. Removed mini-game. Content from LinkedIn (edu, robotics, Sci Oly, orchestra, BSA, AI Fluency cert, True Blue 100).
**Code:** files above. 5 photos serve 9 biomes via crop/zoom/filter. Verified all 9 slots desktop (1440x860) + mobile (375) in browser.
**Haiku findings:**
- No breaking issues found. All imports/exports correct, React hooks properly scoped with cleanup, event listeners cleaned up, keyboard/wheel handlers working correctly. Build passes without errors or warnings.

## Fix: Railway deploy failed (2026-10-07)
- Cause: `scripts/icons.py` wrote `src/icons.js` with Windows cp1252 (em dash in header) → nixpacks "stream did not contain valid UTF-8".
- Fix: `write_text(..., encoding='utf-8')`. Always write generated files as UTF-8.
