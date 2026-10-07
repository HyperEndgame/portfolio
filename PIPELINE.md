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

## Feature 3: video-style ambience (2026-10-07)
**Plan (Opus):** Reference backgrounds are AI video loops (pulsing light sources, light shafts, glints, depth petals, idle character). Fake it over stills: `Ambience.jsx` renders lights/shafts/glints/haze pinned in image-% coords; `Background.jsx` computes object-fit:cover box so overlays track the photo through crop/zoom/Ken Burns. `scenes` in data.js holds per-photo anchors. Near-layer blurred Particles for depth. Player bob + breathe/sway.
**Code:** Ambience.jsx (new), Background.jsx (cover math), data.js `scenes`, index.css amb-* keyframes, Particles `near` prop, App NEAR set, Player breathe.
**Haiku findings:**
- All biome src filenames have matching scene keys (cherry-river, cherry-grove, end, lush-caves, village).
- cover() math correct: CSS object-fit:cover with parallax bleed and anchor scaling.
- Particles near layer: all n calculations non-zero; no NaN.
- React keys: compound keys ensure uniqueness (e.g., `${k}-${i}` for lights/shafts/glints).
- Listener cleanup: all addEventListener/removeEventListener pairs matched; RAF cancellations present.
- Build passes: 310KB JS, 25KB CSS; all chunks transformed.
- UTF-8: all 15 files valid.
- None breaking.

## Feature 4: audit + perf + mobile (2026-10-07)
**Plan (Opus):** Apply ponytail audit (dead Google Fonts, dead tailwind extends, unused palette icon + hit/break sounds, Pixel string branch, lucide → 6 inline SVGs). Perf: drop backdrop-filter, blur filters, mix-blend; shafts → soft radial gradients; near particle layer desktop-only w/o CSS blur; 1x canvas; LazyMotion+domAnimation (layoutId selector → CSS left transition); 1280w srcset + preload. Mobile: tooltips off on touch (stuck after tap), dedicated head crop for Profile, swipe to change slot, touch-action/overscroll, splash moved off subtitle.
**Code:** Ico.jsx (new), Pixel, Hud, Screens, App (useSwipe, usePreload, LazyMotion), Background (srcset, scene guard), Particles, Tooltip, Ambience, index.css, data.js, icons.py, public/img (*-1280.webp, player-head.png). JS 310→265 KB. Lush Caves 91 fps (refresh-capped).
**Haiku findings:**
- No `motion.` usage (strict LazyMotion mode — all `m.*` framer-motion components correct).
- No lucide-react imports (Ico.jsx 6 inline SVGs verified).
- All Ico names used exist: arrow, check, copy, external, volume, mute.
- srcSet 1280w files exist for all 5 biomes (cherry-river/-grove, end, lush-caves, village).
- player-head.png exists; `me.head` used in Screens Profile.
- Hotbar selector calc correct for 9 slots: (100%-22px)/9 per slot, 2px gaps, 3px padding, ±5px border offset.
- useSwipe/usePreload event listeners cleaned up in return statements.
- Tooltip returns {} on touch — no spread errors (ternary binds={} : {...}).
- `npm run build` passes: 265 KB JS, 25 KB CSS.
- All src files valid UTF-8 (US-ASCII subset, Rails-safe).
- None breaking.
- Follow-up: photo fades in on load and Ambience waits for it (no lights over black on cold load); skill rows reflow on mobile (names no longer truncated).

## Feature 5: mobile character, XP, petals, audio (2026-10-07)
**Plan (Opus):** Character visible on mobile (centered band above a bottom sheet at 38vh; top-right on menu/end). XP fixed: level 15, 10/12. Slot 3 off end.webp → cherry-grove purple grade ("Enchanted Grove"). Petals: pre-rendered notched-petal sprites, 15–26px, spin+flip tumble. Audio: real Minecraft sounds/music are Mojang-copyrighted → original generative ambient piano (Web Audio, starts on first gesture, M toggles) + softer clicks. Mobile perf: particles 1/3 count @30fps, no Ken Burns/glints/haze, half the lights, no drop-shadow; menu renders without entry animation.
**Code:** sound.js (music), Particles (petal sprites, mobile throttle), Player (mobile placement), App (sheet top, fixed XP, initial={false}), data.js slot 3, Screens (menu static, profile head desktop-only), index.css mobile media query.
**Haiku findings:**
- src/components/Player.jsx:13 — AnimatePresence key `view + side + (slot === 1)` doesn't change on slots 2→3→4 transitions (all 'frontrightFalse'), so Player doesn't animate between them — minor (animations skip but content renders correctly).
- src/sound.js, src/components/Particles.jsx, src/App.jsx, src/components/Screens.jsx, src/data.js — all valid. Build passes, no breaking issues found.
- All src files valid UTF-8, gesture listener cleanup correct (self-removing), RAF re-queue/cancel pair matched, Particles mobile 30fps throttle correct (skip draw not RAF), data.js slot 3 matches plan (cherry-grove, glyphs, purple).
- None breaking.
- Player key reuse across slots 2-4 is intentional: character stays put when only the panel changes.
