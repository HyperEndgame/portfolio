// Content for each hotbar slot.
import { useState } from 'react'
import { ArrowRight, Copy, Check, ExternalLink } from 'lucide-react'
import Pixel from './Pixel'
import Tip from './Tip'
import { play } from '../sound'
import { me, skills, projects, journey, advancements, trades } from '../data'
import * as I from '../icons'

const H = ({ children }) => <h2 className="ts mb-4 text-lg font-semibold text-[#e0e0e0] sm:text-xl">{children}</h2>
const Btn = ({ children, onClick, className = '' }) => (
  <button onClick={() => { play('click'); onClick?.() }} className={`mc-btn h-10 px-4 text-sm sm:text-base ${className}`}>{children}</button>
)

export function Menu({ go, mine }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <h1 className="ts-lg font-title text-4xl font-bold tracking-wide text-[#f0f0f0] sm:text-6xl lg:text-7xl">{me.name} Builds</h1>
        <span className="splash ts absolute -bottom-5 right-0 whitespace-nowrap sm:bottom-0 text-xs text-splash sm:-right-16 sm:text-base">Now with 100% more blocks!</span>
      </div>
      <p className="ts mb-8 mt-3 tracking-[.3em] text-mcgray">SURVIVAL · HARD MODE</p>
      <div className="flex w-full max-w-[400px] flex-col gap-2.5">
        <Btn onClick={() => go(2)}>Enter World</Btn>
        <Btn onClick={() => go(4)}>View Builds</Btn>
        <Btn onClick={() => go(7)}>Villager Trades</Btn>
        <div className="grid grid-cols-2 gap-2.5">
          <Btn onClick={() => go(8)}>Contact</Btn>
          <Btn onClick={() => go(9)}>The End</Btn>
        </div>
        <Btn onClick={mine}>Mine for the Amulet</Btn>
      </div>
      <p className="ts mt-4 text-xs text-mcgray">Press 1-9 or click the hotbar · M toggles sound</p>
    </div>
  )
}

export function Profile({ go }) {
  return (
    <>
      <H>Player Profile</H>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="mc-slot grid h-32 w-32 shrink-0 place-items-center self-center sm:self-start">
          <Pixel icon={I.head} size={88} />
        </div>
        <div className="flex-1">
          <p className="mb-4 text-sm leading-relaxed text-[#d8d8d8]">{me.bio}</p>
          <dl className="text-sm">
            {me.stats.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-white/10 py-1.5">
                <dt className="text-[#e0e0e0]">{k}</dt>
                <dd className={`text-right ${k === 'Status' ? 'text-[#55ff55]' : 'text-mcgray'}`}>{v}</dd>
              </div>
            ))}
          </dl>
          <Btn className="mt-5" onClick={() => go(5)}>View Journey</Btn>
        </div>
      </div>
    </>
  )
}

export function Skills() {
  return (
    <>
      <H>Enchantments</H>
      <div className="flex flex-col gap-4">
        {skills.map(s => (
          <Tip key={s.name} title={`${s.name} ${s.lvl}`} lore={s.lore} color="#55ffff" className="w-full">
            <div className="flex items-center gap-3" tabIndex={0}>
              <div className="mc-slot grid h-10 w-10 shrink-0 place-items-center"><Pixel icon={I.book} size={26} /></div>
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[#c8a8ff]">{s.name}</span>
                  <span className="text-mcgray">Level {s.lvl} · {s.pct}%</span>
                </div>
                <div className="h-3 border-2 border-black bg-[#1a1a1a]">
                  <div className="h-full bg-gradient-to-r from-[#8040ff] to-[#d080ff] shadow-[0_0_8px_#a060ff]" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            </div>
          </Tip>
        ))}
      </div>
    </>
  )
}

export function Builds() {
  const [sel, setSel] = useState(0)
  const p = projects[sel]
  const cells = [...projects, ...Array(Math.max(0, 9 - projects.length)).fill(null)]
  return (
    <>
      <H>Chest - Completed Builds</H>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="grid shrink-0 grid-cols-3 gap-1 self-center sm:self-start">
          {cells.map((c, i) => c ? (
            <Tip key={i} title={c.title} lore={c.tags.join(' · ')} color="#ffff55">
              <button onClick={() => { play('click'); setSel(i) }} aria-label={c.title}
                className={`mc-slot grid h-14 w-14 place-items-center ${sel === i ? 'outline outline-2 outline-white' : ''}`}>
                <Pixel icon={c.icon} size={34} />
              </button>
            </Tip>
          ) : <div key={i} className="mc-slot h-14 w-14" />)}
        </div>
        <div className="flex-1">
          <h3 className="ts text-lg text-[#ffff55]">{p.title}</h3>
          <p className="mb-3 mt-1 text-sm leading-relaxed text-[#d8d8d8]">{p.desc}</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {p.tags.map(t => <span key={t} className="border border-[#5000aa] bg-black/40 px-2 py-0.5 text-xs text-[#a8a8ff]">{t}</span>)}
          </div>
          {p.link
            ? <a href={p.link} target="_blank" rel="noreferrer" onClick={() => play('click')} className="mc-btn inline-flex h-10 items-center gap-2 px-4 text-sm">View Project <ExternalLink size={14} /></a>
            : <span className="text-xs text-mcgray">Link coming soon</span>}
        </div>
      </div>
    </>
  )
}

export function Journey() {
  return (
    <>
      <H>Crafting - The Journey</H>
      <div className="flex flex-col">
        {journey.map((j, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-white/10 py-4 last:border-0">
            <div className="flex shrink-0 gap-1">
              {j.items.map((it, k) => <div key={k} className="mc-slot grid h-9 w-9 place-items-center"><Pixel icon={it} size={22} /></div>)}
            </div>
            <ArrowRight className="shrink-0 text-mcgray" size={18} />
            <div>
              <div className="text-xs text-mcgray">{j.when}</div>
              <div className="ts text-[#ffff55]">{j.title}</div>
              <div className="text-sm text-[#d0d0d0]">{j.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function Advancements({ unlocked }) {
  return (
    <>
      <H>Advancements</H>
      <div className="grid gap-2 sm:grid-cols-2">
        {advancements.map(a => {
          const lock = a.secret && !unlocked
          return (
            <div key={a.title} className={`flex items-center gap-3 border-2 border-black bg-[#212121] p-2 shadow-[inset_2px_2px_0_#3a3a3a] ${lock ? 'opacity-50' : ''}`}>
              <div className="grid h-11 w-11 shrink-0 place-items-center bg-[#c6a24a] shadow-[inset_-2px_-2px_0_#7a5a10,inset_2px_2px_0_#f0d080]">
                <Pixel icon={lock ? I.lucky : a.icon} size={26} />
              </div>
              <div>
                <div className={a.secret ? 'text-[#ff55ff]' : 'text-[#ffff55]'}>{lock ? '???' : a.title}</div>
                <div className="text-xs text-[#d0d0d0]">{lock ? 'Mine for it from the main menu' : a.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export function Trades({ go }) {
  return (
    <>
      <H>Villager Trades</H>
      <div className="flex flex-col gap-2">
        {trades.map(t => (
          <Tip key={t.title} title={t.title} lore={t.desc} color="#55ff55" className="w-full">
            <button onClick={() => { play('levelup'); go(8) }}
              className="flex w-full items-center gap-3 border-2 border-black bg-[#2a2a2a] p-2 text-left shadow-[inset_2px_2px_0_#444] hover:bg-[#3a3a4a]">
              <div className="mc-slot relative grid h-10 w-10 place-items-center">
                <Pixel icon={I.emerald} size={24} />
                <span className="ts absolute bottom-0 right-0.5 text-xs">{t.cost}</span>
              </div>
              <ArrowRight className="text-mcgray" size={18} />
              <div className="mc-slot grid h-10 w-10 place-items-center"><Pixel icon={t.icon} size={24} /></div>
              <div className="flex-1">
                <div className="text-[#e0e0e0]">{t.title}</div>
                <div className="text-xs text-mcgray">{t.desc}</div>
              </div>
            </button>
          </Tip>
        ))}
      </div>
      <p className="mt-3 text-xs text-mcgray">Click a trade to send a message.</p>
    </>
  )
}

export function Contact() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const send = (e) => {
    e.preventDefault()
    play('levelup')
    const q = `subject=${encodeURIComponent(`Portfolio message from ${name || 'a visitor'}`)}&body=${encodeURIComponent(msg)}`
    window.location.href = `mailto:${me.email}?${q}`
  }
  const field = 'w-full border-2 border-black bg-[#0e0e0e] px-2 py-1.5 text-sm text-white outline-none focus:border-white'
  return (
    <>
      <H>Book & Quill - Contact</H>
      <form onSubmit={send} className="flex flex-col gap-3 bg-[#e8dcb8] p-4 text-[#2a1a0a] shadow-[inset_0_0_0_3px_#b8a070]">
        <label className="text-sm">Your name
          <input value={name} onChange={e => setName(e.target.value)} className={field} autoComplete="name" />
        </label>
        <label className="text-sm">Message
          <textarea required rows={4} value={msg} onChange={e => setMsg(e.target.value)} className={`${field} resize-none`} />
        </label>
        <Btn className="self-start">Sign & Send</Btn>
      </form>
      <Links />
    </>
  )
}

function Links() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(me.email); setCopied(true); play('pop'); setTimeout(() => setCopied(false), 1500) } catch {}
  }
  const item = 'flex items-center gap-3 border-2 border-black bg-[#2a2a2a] p-2 shadow-[inset_2px_2px_0_#444] hover:bg-[#3a3a4a]'
  return (
    <div className="mt-4 flex flex-col gap-2">
      <button onClick={copy} className={item}>
        <div className="mc-slot grid h-10 w-10 place-items-center"><Pixel icon={I.quill} size={24} /></div>
        <div className="flex-1 text-left"><div>Email</div><div className="text-xs text-mcgray">{me.email}</div></div>
        {copied ? <Check size={16} className="text-[#55ff55]" /> : <Copy size={16} className="text-mcgray" />}
      </button>
      <a href={me.github} target="_blank" rel="noreferrer" onClick={() => play('click')} className={item}>
        <div className="mc-slot grid h-10 w-10 place-items-center"><Pixel icon={I.chest} size={24} /></div>
        <div className="flex-1"><div>GitHub</div><div className="text-xs text-mcgray">github.com/HyperEndgame</div></div>
        <ExternalLink size={16} className="text-mcgray" />
      </a>
      <a href={me.linkedin} target="_blank" rel="noreferrer" onClick={() => play('click')} className={item}>
        <div className="mc-slot grid h-10 w-10 place-items-center"><Pixel icon={I.emerald} size={24} /></div>
        <div className="flex-1"><div>LinkedIn</div><div className="text-xs text-mcgray">{me.full}</div></div>
        <ExternalLink size={16} className="text-mcgray" />
      </a>
    </div>
  )
}

export function End() {
  return (
    <>
      <H>The End</H>
      <p className="mb-2 text-sm leading-relaxed text-[#c8b8ff]">
        You found the end of the world. Thanks for exploring — the portal home is always in the hotbar.
      </p>
      <p className="text-xs text-mcgray">Want to build something together? Reach out below.</p>
      <Links />
    </>
  )
}
