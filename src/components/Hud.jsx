// HUD: top-left info, F3 debug, sound toggle, vitals + XP + hotbar, toasts.
import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Ico from './Ico'
import Pixel from './Pixel'
import { useTip } from './Tooltip'
import { heart, food } from '../icons'
import { me, slots } from '../data'

// real day of the month + local time
function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  return `Day ${now.getDate()} · ${time}`
}

export function Info({ biome }) {
  const clock = useClock()
  return (
    <div className="ts pointer-events-none absolute left-4 top-3 z-30 text-[12px] leading-[1.7] text-[#e8e8e8] sm:text-[13px]">
      <div>{me.full} <span className="text-[#55ff55]">v1.0.0</span></div>
      <div>Biome: <span style={{ color: biome.color }}>{biome.name}</span></div>
      <div>{clock}</div>
    </div>
  )
}

export function Debug({ biome, slot }) {
  const [p, setP] = useState({ x: 0, y: 0, fps: 60, w: innerWidth, h: innerHeight })
  useEffect(() => {
    let frames = 0, last = performance.now(), raf, mx = 0, my = 0
    const move = (e) => { mx = e.clientX; my = e.clientY }
    const loop = (t) => {
      frames++
      if (t - last > 500) {
        setP({ x: mx, y: my, fps: Math.round(frames * 1000 / (t - last)), w: innerWidth, h: innerHeight })
        frames = 0; last = t
      }
      raf = requestAnimationFrame(loop)
    }
    addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move) }
  }, [])
  const rows = [
    `${me.full} 1.0.0 (portfolio/vanilla)`,
    `${p.fps} fps`,
    `XYZ: ${(p.x / 10).toFixed(3)} / 64.00000 / ${(p.y / 10).toFixed(3)}`,
    `Facing: ${p.x > innerWidth / 2 ? 'east (Towards positive X)' : 'west (Towards negative X)'}`,
    `Biome: rohtak:${biome.name.toLowerCase().replace(/ /g, '_')}`,
    `Slot: ${slot} / 9`,
    `Display: ${p.w}x${p.h}`,
  ]
  return (
    <div className="pointer-events-none absolute left-4 top-[74px] z-30 flex flex-col items-start gap-[2px] text-[12px]">
      {rows.map(r => <span key={r} className="bg-black/55 px-1 text-[#e0e0e0]">{r}</span>)}
    </div>
  )
}

export function SoundToggle({ on, toggle }) {
  return (
    <button onClick={toggle} aria-label={on ? 'Mute sound (M)' : 'Enable sound (M)'} title="Sound (M)"
      className="mc-btn absolute right-4 top-3 z-40 grid h-10 w-10 place-items-center">
      <Ico name={on ? 'volume' : 'mute'} size={18} />
    </button>
  )
}

function Vitals({ level, xp }) {
  const row = (icon) => [...Array(10)].map((_, i) => <Pixel key={i} icon={icon} size={13} />)
  return (
    <div className="mb-1.5 w-full px-1">
      <div className="mb-1 flex justify-between">
        <div className="flex gap-[2px]">{row(heart)}</div>
        <div className="flex flex-row-reverse gap-[2px]">{row(food)}</div>
      </div>
      <div className="relative h-[9px] border-2 border-black bg-[#1b1b1b]">
        <m.div className="h-full bg-[#80ff20] shadow-[inset_0_-2px_0_#3d8c0f,inset_0_2px_0_#c4ff8a]"
          animate={{ width: `${xp * 100}%` }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} />
        <m.span key={level} initial={{ scale: 1.6 }} animate={{ scale: 1 }}
          className="absolute -top-[19px] left-1/2 -translate-x-1/2 text-[15px] font-bold text-[#80ff20] [text-shadow:2px_0_#000,-2px_0_#000,0_2px_#000,0_-2px_#000]">
          {level}
        </m.span>
      </div>
    </div>
  )
}

export function Hotbar({ slot, go, level, xp }) {
  const tip = useTip()
  return (
    <div className="absolute bottom-3 left-1/2 z-[48] flex w-[min(96vw,500px)] select-none -translate-x-1/2 flex-col items-center">
      <Vitals level={level} xp={xp} />
      <nav aria-label="Hotbar" className="hb relative flex w-full gap-[2px] p-[3px]">
        {slots.map(s => (
          <button key={s.n} onClick={() => go(s.n)} aria-label={s.label} aria-current={slot === s.n}
            {...tip({ title: s.label, lore: s.lore, hint: `Press ${s.n}` })}
            className="hb-slot relative grid aspect-square flex-1 place-items-center">
            <span className="ts-sm absolute left-1 top-0 text-[9px] text-[#d0d0d0]">{s.n}</span>
            <Pixel icon={s.icon} size={30} className={`transition-transform duration-150 drop-shadow-[2px_2px_0_rgba(0,0,0,.35)] ${slot === s.n ? 'scale-110' : ''}`} />
          </button>
        ))}
        {/* selector slides with a CSS transition: 9 slots, 2px gaps, 3px padding */}
        <span className="hb-sel transition-[left] duration-150 ease-out"
          style={{ left: `calc(3px + (100% - 22px) / 9 * ${slot - 1} + ${(slot - 1) * 2}px - 5px)`, width: 'calc((100% - 22px) / 9 + 10px)' }} />
      </nav>
      <div className="ts-sm mt-1.5 hidden gap-3 text-[10px] text-[#9a9a9a] sm:flex">
        <span><b className="text-[#d8d8d8]">1-9</b> select</span>
        <span><b className="text-[#d8d8d8]">← →</b> cycle</span>
        <span><b className="text-[#d8d8d8]">Esc</b> home</span>
        <span><b className="text-[#d8d8d8]">M</b> sound</span>
        <span><b className="text-[#d8d8d8]">F3</b> debug</span>
      </div>
    </div>
  )
}

export function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <m.div key={toast.title} role="status"
          className="fixed right-4 top-16 z-[80] flex w-[min(300px,calc(100vw-32px))] items-center gap-3 border-2 border-black bg-[#212121]/95 p-2.5 shadow-[inset_0_0_0_2px_#555]"
          initial={{ x: 340 }} animate={{ x: 0 }} exit={{ x: 340 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
          <div className="slot grid h-11 w-11 shrink-0 place-items-center"><Pixel icon={toast.icon} size={28} /></div>
          <div className="text-[13px]">
            <div className="text-[#ffff55]">Advancement Made!</div>
            <div>{toast.title}</div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
