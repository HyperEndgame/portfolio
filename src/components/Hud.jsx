// Top-left info, sound toggle, and bottom vitals + hotbar.
import { useEffect, useState } from 'react'
import { Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react'
import Pixel from './Pixel'
import Tip from './Tip'
import { heart, food } from '../icons'
import { me, slots } from '../data'

// 1 real second = 1 in-game minute, starting 06:00 on day 1
function useClock() {
  const [m, setM] = useState(6 * 60)
  useEffect(() => {
    const id = setInterval(() => setM(v => v + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const day = Math.floor(m / 1440) + 1
  const hh = String(Math.floor((m % 1440) / 60)).padStart(2, '0')
  const mm = String(m % 60).padStart(2, '0')
  return `Day ${day} - ${hh}:${mm}`
}

export function Info({ biome }) {
  const clock = useClock()
  return (
    <div className="ts pointer-events-none absolute left-3 top-3 z-30 text-xs leading-relaxed text-mcgray sm:text-sm">
      <div>{me.name} Builds <span className="text-[#55ff55]">v1.0.0</span></div>
      <div>Biome: <span className="text-[#ffff55]">{biome}</span></div>
      <div>{clock}</div>
    </div>
  )
}

export function SoundToggle({ on, toggle }) {
  const Icon = on ? Volume2 : VolumeX
  return (
    <button onClick={toggle} aria-label={on ? 'Mute sound (M)' : 'Enable sound (M)'} title="Toggle sound (M)"
      className="mc-btn absolute right-3 top-3 z-40 grid h-10 w-10 place-items-center">
      <Icon size={20} />
    </button>
  )
}

function Row({ icon, flip }) {
  return (
    <div className={`flex gap-[2px] ${flip ? 'flex-row-reverse' : ''}`}>
      {[...Array(10)].map((_, i) => <Pixel key={i} icon={icon} size={14} />)}
    </div>
  )
}

export function Hotbar({ slot, go, open, setOpen }) {
  return (
    <div className="absolute bottom-2 left-1/2 z-[48] flex -translate-x-1/2 flex-col items-center">
      <button onClick={() => setOpen(!open)} aria-label={open ? 'Hide vitals' : 'Show vitals'}
        className="ts mb-1 text-mcgray md:hidden">
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      {open && (
        <div className="w-full">
          <div className="mb-1 flex justify-between px-1">
            <Row icon={heart} />
            <Row icon={food} flip />
          </div>
          <div className="relative mb-1 h-[10px] border-2 border-black bg-[#1a1a1a]">
            <div className="h-full w-[72%] bg-[#80ff20] shadow-[inset_0_-2px_0_#3a8a10]" />
            <span className="ts absolute -top-5 left-1/2 -translate-x-1/2 font-title text-base font-bold text-[#80ff20]">30</span>
          </div>
        </div>
      )}
      <nav aria-label="Hotbar" className="flex gap-[3px] bg-black/40 p-[3px]">
        {slots.map(s => (
          <Tip key={s.n} title={s.label} lore={`Press ${s.n}`}>
            <button onClick={() => go(s.n)} aria-label={s.label} aria-current={slot === s.n}
              className={`hb-slot relative grid h-9 w-9 place-items-center sm:h-12 sm:w-12 ${slot === s.n ? 'hb-active' : ''}`}>
              <span className="ts absolute left-0.5 top-0 text-[9px] text-mcgray">{s.n}</span>
              <Pixel icon={s.icon} size={24} className="sm:scale-125" />
            </button>
          </Tip>
        ))}
      </nav>
    </div>
  )
}
