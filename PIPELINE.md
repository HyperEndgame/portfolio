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

## Feature 6: content + polish round (2026-10-07)
**Plan (Opus):** Remove radial vignette; parallax only on slot 1 (Background `parallax` prop, resets transform); blocky 5x5 pixel petals w/ stepped flip (no smooth spin); HUD shows real day-of-month + local time; name → "Rohtak Harith", subtitle → "MY PORTFOLIO"; nametag "Hyper_Endgame" above player on home; Spawn → Bangalore, India + Home Base Knoxville, TN; Class → Student; VEX only in Robotics Club journey entry; contact "within 48 hours"; Sakai project (public repo); hand-drawn 10x10 head icon (auto-sampling broke right eye) + phone icon.
**Code:** data.js, Hud.jsx (useClock), Screens.jsx, Background.jsx, App.jsx, Player.jsx (nametag), Particles.jsx (petal sprite), scripts/icons.py (head, phone), index.html title.
**Haiku findings:**
- Background.jsx useParallax: effect deps [on], transform reset, cleanup all correct.
- Hud.jsx useClock: interval cleanup, toLocaleTimeString usage correct.
- Player.jsx: nametag uses me.tag (exists in data.js line 8).
- Particles.jsx: 5x5 canvas, imageSmoothingEnabled=false, setTransform reset (line 52) correct.
- data.js: I.phone exported (icons.js line 30), VEX only in Robotics journey (line 116), Spawn/Home Base correct.
- No leftover "Builds" title text; component name only.
- Build passes: 267KB JS, 26KB CSS.
- All UTF-8 valid (em-dash in icons.js header properly encoded).
- CRLF line endings on several src files (Windows); minor cosmetic issue, not breaking.
- None breaking.

## Fix: mobile particles CSS (2026-10-07)
- **Bug:** canvas className removed `h-full w-full` in favor of `left-0 top-0` — canvas rendered at 300×150px default size instead of filling viewport
- **Cause:** Size refactor meant to simplify CSS but broke coverage
- **Fix:** Restored `inset-0 w-full h-full` to fix viewport fill; 1x canvas + `image-rendering: pixelated` retained
- **Verified:** Canvas now covers viewport; time-based 30fps mobile cap and resize-on-width-change logic are correct; mobile CSS static ambience prevents compositing churn

## Review 1: full-site review (2026-10-07)
**Findings → fixes (Opus review, Sonnet fix):**
- Tooltip stuck after click that changes screen (trades → contact) — mouseleave never fires on unmount. Fix: TipProvider `reset={slot}` clears tip.
- srcSet never served 1280w on phones (portrait cover needs ~1500 CSS px) and preload fetched 1280 → double download. Fix: one `photo()` helper in data.js used by <img> and preload (phones <768px → 1280).
- Builds grid `Array(12 - n)` throws when >12 projects. Fix: Math.max(0, …).
- Mobile nametag under sound button / clipped. Fix: phone character top-[86px] h-[18vh], tag right-aligned on phones; menu pt-[26vh].
- Music kept composing in background tabs. Fix: visibilitychange stop/start.
- `select-none` on <main> blocked selecting email/bio text. Fix: only on hotbar.
- Menu hint said "Press 1-9" on phones. Fix: "Tap the hotbar or swipe" below md.
- Checked OK: gzip + 4h cache on live assets, keyboard/wheel/swipe handlers, listener cleanup, toast timers, LazyMotion strict (no motion.*).
**Haiku findings:** None breaking. All fixes verified: Tooltip.jsx reset prop + effect (line 8,13), App.jsx TipProvider reset={slot} (line 141), usePreload uses photo() (line 82), data.js photo helper uses innerWidth (line 7), Background.jsx uses photo(src) (line 54), Screens.jsx Math.max(0, 12-n) (line 106), Player.jsx mobile classes (line 9,20), sound.js visibilitychange handler (line 106), Hud.jsx select-none on hotbar wrapper (line 97), Menu hint conditional (line 49). Build: 267KB JS, 26KB CSS. All src files valid UTF-8.
- Sonnet: rejected haiku's canvas finding. Canvas width/height attrs = innerWidth/innerHeight, so its CSS size is already the full viewport (measured 375x812 at 375x812). `w-full h-full` would stretch it when the phone address bar resizes the viewport. Reverted.

## Feature 7: mobile CSS particles + text changes (2026-10-07)
**Plan (Opus):** Phones render particles via CSS keyframes instead of canvas: CssParticles component spawns 1/3 particle count with per-particle `--dx` drift, `pt`/`pt-up`/`pt-sway`/`pt-glow` classes for CSS animations. Removes expensive per-frame canvas repaint; compositor handles motion. Slot 4: rename Dripstone Caves → Lush Caves (green #7dffb0), change fx embers → fireflies, drop filter. Text: HUD shows "Work in progress", footer "Built with Claude".
**Code:** Particles.jsx CssParticles (memoized spawn + animation calcs), index.css keyframes (@keyframes pt-down/up/sway/glow), App.jsx remove 'embers' from NEAR Set, Hud.jsx footer text, data.js slot 4 rename+color+fx.
**Haiku findings:** None breaking. CssParticles spawn logic sound (vy range detection, dur clamping 0.15 min), drift calc keeps particles in-frame. Image generation from petal()/rune() to dataURL valid. Keyframes use var(--dx) bound in inline styles. Build: 268KB JS, 27KB CSS. All src valid UTF-8.

## Fix: Background black-flash on biome switch (2026-10-07)
**Cause:** Framer Motion `AnimatePresence` faded out old image before new one decoded; switching faster than decode resulted in black flash.
**Plan:** Keep last visible photo underneath until new one decodes + settles (800ms). `useLayers` ref tracks two layers: `base` (last shown) and `top` (current). Each layer renders keyed by `id(src+pos)`. Photo.onReady fires after decode; timer waits 800ms, then updates base. Rapid switches reset timer (no gap). Keys prevent collision; no layer stuck since base unmounts when ids match post-timer.
**Code:** Photo.onReady callback (line 51), useLayers hook (lines 74-84), Layer component wrapper (lines 62-72), Background render returns Layer array with conditional base layer (lines 98-99). Removed AnimatePresence + framer-motion m.div.
**Findings:** No breaking bugs. id() collisions impossible (src+pos unique per biome). Visible sequence sound: base renders while top decodes, no black flash. Layer unmount correct (unsets when ready+timer fires or switches before timer complete). Ref mutations idempotent during render. Rapid switches tested: timer resets, old photo stays visible, new photo eventually shows—no stuck layers, no flashing.

## Feature 8: home video background (2026-10-07)
**Plan:** Slot 1 (Cherry Valley → "Home") plays looping muted video (1920p desktop, 1280p phones) with still-image poster. Ambience disabled (video supplies motion). Ken Burns disabled. Particles removed.
**Code:** Slot 1 `src: home.webp` → poster; `video: home.mp4` (muted loop, calls play() on readyState≥2 for desktop autoplay fallback). `photo()` regex updated: `/\.(webp|mp4)$/` → `-1280.$1` (matches both file types). `Photo` component: conditional render (video vs img), `onLoadedData` for video ready state. `App.jsx`: guard `{b.fx && <Particles/>}` (slot 1 has no fx).
**Findings:** No breaking bugs. Regex correct for both webp/mp4. `readyState >= 2` check safe on img elements (optional chaining → undefined, fails gracefully). Video poster and src both use photo() helper → consistent 1280px on phones. Particles guard prevents crash when fx undefined.

## Review 2: home video quality (2026-10-07)
**Plan:** Desktop video now uses `<source>` list: AV1 1440p primary, HEVC 1440p secondary, H.264 1080p fallback. Phones keep H.264 1280. Verified codec strings and source logic.
**Code:** Background.jsx `sources()` helper → innerWidth conditional (phones get 1-source list, desktop 3 sources). Codec type strings: `av01.0.12M.08` (AV1), `hvc1.1.6.L150.B0` (HEVC), fallback H.264 typeless. `onLoadedData` event works correctly with `<source>` children.
**Findings:** No breaking bugs. readyState/ready logic unaffected by `<source>` children; onLoadedData fires once playable. Fallback chain (AV1→HEVC→H.264) ensures playback even if codec strings mismatch. `photo()` applied consistently to all sources. Phones/desktop conditional correct on 768px breakpoint.

## Background quality (2026-10-07)
**Plan:** re-export biome photos from the best available originals instead of the old q82→q78 recompressions.
**Code:** cherry-river from 2560x1369 PNG, lush-caves from 2752 watermark-free PNG (resized to 2560), cherry-grove and end from lossless 1920 PNGs, village from 1920 JPG (no larger source). Desktop webp q90 (max 2560w), phone -1280 q86. Aspect ratios unchanged, so scene coords and `size` in data.js stay valid.
**Findings:** no code change; verified 2560 files load and the lights stay aligned (lush caves).

## Fix: Centering + rapid-switch fix (2026-10-07)
**Cause:** Framer Motion `AnimatePresence mode="wait"` in App.jsx + Player.jsx + exit animations left the panel showing stale content or invisible after rapid 1-9 slot switching. Exit phase queued before next enter, creating timing gaps where old content lingered.
**Plan:** Drop AnimatePresence; rely on key changes to trigger remounts. `m.*` components inside LazyMotion strict mode animate in via `initial`/`animate` props alone. No exit animations = instant unmount on key change, no stale-screen window. Removed md:pr-[22vw]/[18vw] padding overrides (home + End now centered like other slots).
**Code:** App.jsx (removed AnimatePresence import + wrapper + exit props from both m.section; removed padding override), Player.jsx (removed AnimatePresence import + wrapper + exit prop from m.div). Keys intact (slot, view+side+(slot===1)).
**Findings:** No breaking bugs. LazyMotion strict mode ✓ (all m.* properly scoped). No unused imports (AnimatePresence removed cleanly). No leftover exit props. Keys trigger remount on slot/view changes → enter animation fires correctly. Tested 50 rapid 1-9 switches: panel always shows correct biome + visible, player animates in. Build passes.
