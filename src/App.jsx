import { useCallback, useEffect, useRef, useState } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import Background from './components/Background'
import Particles from './components/Particles'
import Player from './components/Player'
import { TipProvider } from './components/Tooltip'
import { Info, Debug, SoundToggle, Hotbar, Toast } from './components/Hud'
import * as S from './components/Screens'
import { biomes, photo } from './data'
import * as I from './icons'
import { play, isOn, setOn } from './sound'

// per-slot layout: where the panel sits and how the player stands
const LAYOUT = {
  1: { panel: 'center', view: 'front', side: 'right' },
  2: { panel: 'left', view: 'front', side: 'right' },
  3: { panel: 'left', view: 'front', side: 'right' },
  4: { panel: 'left', view: 'front', side: 'right' },
  5: { panel: 'left', view: 'back', side: 'right' },
  6: { panel: 'right', view: 'back', side: 'left' },
  7: { panel: 'left', view: 'front', side: 'right' },
  8: { panel: 'left', view: null },
  9: { panel: 'center', view: 'back', side: 'right' },
}

const TOASTS = {
  4: { icon: I.chest, title: 'Taking Inventory' },
  9: { icon: I.pearl, title: 'The End?' },
  all: { icon: I.compass, title: 'Adventuring Time' },
}

function useKeys(go, cycle, toggleSound, toggleDebug) {
  useEffect(() => {
    const key = (e) => {
      if (e.target.closest('input, textarea') || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key >= '1' && e.key <= '9') go(+e.key)
      else if (e.key === 'ArrowRight') cycle(1)
      else if (e.key === 'ArrowLeft') cycle(-1)
      else if (e.key === 'Escape') go(1)
      else if (e.key.toLowerCase() === 'm') toggleSound()
      else if (e.key === 'F3') { e.preventDefault(); toggleDebug() }
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [go, cycle, toggleSound, toggleDebug])
}

// scroll wheel cycles slots unless the wheel is over a scrollable panel
function useWheel(cycle) {
  const last = useRef(0)
  useEffect(() => {
    const wheel = (e) => {
      if (e.target.closest('[data-scroll]')) return
      const now = Date.now()
      if (now - last.current < 280 || Math.abs(e.deltaY) < 8) return
      last.current = now
      cycle(e.deltaY > 0 ? 1 : -1)
    }
    addEventListener('wheel', wheel, { passive: true })
    return () => removeEventListener('wheel', wheel)
  }, [cycle])
}

// horizontal swipe cycles slots on touch screens
function useSwipe(cycle) {
  useEffect(() => {
    let x0 = 0, y0 = 0
    const start = (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY }
    const end = (e) => {
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) cycle(dx < 0 ? 1 : -1)
    }
    addEventListener('touchstart', start, { passive: true })
    addEventListener('touchend', end, { passive: true })
    return () => { removeEventListener('touchstart', start); removeEventListener('touchend', end) }
  }, [cycle])
}

// warm the cache so the first visit to each biome doesn't flash black
function usePreload() {
  useEffect(() => {
    const srcs = [...new Set(Object.values(biomes).map(b => photo(b.src)))]
    const id = setTimeout(() => srcs.forEach(s => { new Image().src = s }), 600)
    return () => clearTimeout(id)
  }, [])
}

// advancement toasts for exploring new screens
function useProgress(slot) {
  const [seen, setSeen] = useState(() => new Set([1]))
  const [toast, setToast] = useState(null)
  useEffect(() => {
    if (seen.has(slot)) return
    const next = new Set(seen).add(slot)
    setSeen(next)
    const t = next.size === 9 ? TOASTS.all : TOASTS[slot]
    play(t ? 'levelup' : 'pop')
    if (t) setToast(t)
  }, [slot, seen])
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(id)
  }, [toast])
  return { toast }
}

const NEAR = new Set(['petals', 'fireflies', 'glyphs', 'end'])
const FINE = matchMedia('(hover: hover) and (min-width: 768px)').matches // desktop: afford the extra layer

const PANEL_POS = {
  left: 'md:left-[5vw] md:w-[min(540px,46vw)]',
  right: 'md:right-[5vw] md:w-[min(500px,44vw)]',
}

export default function App() {
  const [slot, setSlot] = useState(1)
  const [sound, setSound] = useState(isOn)
  const [debug, setDebug] = useState(false)

  const go = useCallback((n) => { play('click'); setSlot(n) }, [])
  const cycle = useCallback((d) => { play('click'); setSlot(s => ((s - 1 + d + 9) % 9) + 1) }, [])
  const toggleSound = useCallback(() => setSound(v => { setOn(!v); return !v }), [])
  const toggleDebug = useCallback(() => setDebug(v => !v), [])
  useKeys(go, cycle, toggleSound, toggleDebug)
  useWheel(cycle)
  useSwipe(cycle)
  usePreload()
  const { toast } = useProgress(slot)

  const b = biomes[slot], L = LAYOUT[slot]
  const screens = {
    1: <S.Menu go={go} />, 2: <S.Profile go={go} />, 3: <S.Skills />, 4: <S.Builds go={go} />,
    5: <S.Journey />, 6: <S.Advancements go={go} />, 7: <S.Trades go={go} />, 8: <S.Contact go={go} />, 9: <S.End go={go} />,
  }
  const boxed = L.panel !== 'center'
  const enter = L.panel === 'right' ? 24 : -24

  return (
    <LazyMotion features={domAnimation} strict>
    <TipProvider reset={slot}>
      <main className="relative h-full w-full overflow-hidden">
        <Background biome={b} side={L.panel} parallax={slot === 1} />
        {b.fx && <Particles fx={b.fx} />}
        {L.view && <Player view={L.view} side={L.side} slot={slot} center={!boxed} />}

        <Info biome={b} />
        {debug && <Debug biome={b} slot={slot} />}
        <SoundToggle on={sound} toggle={toggleSound} />

        {/* no AnimatePresence mode="wait": fast switches left it stuck on a stale or invisible panel */}
          {boxed ? (
            <m.section key={slot} data-scroll aria-label={b.name}
              className={`${slot === 8 ? 'book' : 'panel'} scroll-y fixed inset-x-3 bottom-[150px] ${L.view ? 'top-[38vh]' : 'top-[84px]'} z-[45] p-5 md:absolute md:inset-x-auto md:bottom-auto md:top-[15vh] md:max-h-[calc(85vh-190px)] md:p-6 ${PANEL_POS[L.panel]}`}
              initial={{ opacity: 0, x: enter }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}>
              {screens[slot]}
            </m.section>
          ) : (
            <m.section key={slot} aria-label={b.name}
              className={`absolute inset-x-0 top-0 bottom-[150px] z-30 flex items-center justify-center px-4 pt-[26vh] md:pt-0`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .3 }}>
              {screens[slot]}
            </m.section>
          )}

        {FINE && NEAR.has(b.fx) && <Particles fx={b.fx} near />}
        <Hotbar slot={slot} go={go} level={15} xp={10 / 12} />
        <Toast toast={toast} />

        <p className="ts-sm pointer-events-none absolute bottom-2 left-3 z-20 hidden text-[10px] text-white/45 lg:block">
          Built with Claude · not affiliated with Mojang or Microsoft
        </p>
      </main>
    </TipProvider>
    </LazyMotion>
  )
}
