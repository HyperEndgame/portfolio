// Content for each hotbar slot.
import { useState } from 'react'
import { m } from 'framer-motion'
import Ico from './Ico'
import Pixel from './Pixel'
import { useTip } from './Tooltip'
import { play } from '../sound'
import { me, skills, projects, journey, advancements, trades, tradeStats, links } from '../data'
import * as I from '../icons'

// stagger children on mount
const list = { hidden: {}, show: { transition: { staggerChildren: .05, delayChildren: .08 } } }
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: .3, ease: [0.22, 1, 0.36, 1] } } }
const Stagger = ({ className, children }) => <m.div variants={list} initial="hidden" animate="show" className={className}>{children}</m.div>
const Item = ({ className, children, ...p }) => <m.div variants={item} className={className} {...p}>{children}</m.div>

const Title = ({ children, right }) => (
  <div className="mb-4 flex items-baseline justify-between gap-3">
    <h2 className="ts text-[19px] font-bold text-white">{children}</h2>
    {right && <span className="text-[12px] text-[var(--gray)]">{right}</span>}
  </div>
)
const Hint = ({ children }) => <p className="mt-3 text-[11px] italic text-[var(--dim)]">{children}</p>
export const Btn = ({ children, onClick, className = '' }) => (
  <button onClick={() => { play('click'); onClick?.() }} className={`mc-btn h-11 px-5 text-[14px] ${className}`}>{children}</button>
)

export function Menu({ go }) {
  return (
    <div className="flex w-full max-w-[640px] flex-col items-center text-center">
      <div className="relative mb-2">
        <h1 className="logo whitespace-nowrap text-[clamp(34px,6vw,76px)] leading-none">{me.full}</h1>
        <span className="splash ts absolute -top-6 right-0 whitespace-nowrap text-[11px] sm:top-auto sm:-right-14 sm:bottom-1 sm:text-[15px]">
          Now with 100% more blocks!
        </span>
      </div>
      <p className="ts mb-9 mt-4 text-[12px] tracking-[.35em] text-[#bdbdbd]">MY PORTFOLIO</p>
      <div className="flex w-full max-w-[440px] flex-col gap-2.5">
        <Btn className="w-full" onClick={() => go(2)}>Enter World</Btn>
        <Btn className="w-full" onClick={() => go(4)}>View Builds</Btn>
        <Btn className="w-full" onClick={() => go(7)}>Villager Trades</Btn>
        <div className="grid grid-cols-2 gap-2.5">
          <Btn onClick={() => go(8)}>Contact</Btn>
          <Btn onClick={() => go(9)}>The End</Btn>
        </div>
        
        <Btn className="w-full" onClick={() => go(6)}>Advancements</Btn>
      </div>
      <p className="ts mt-4 text-[11px] text-[#bdbdbd]">Press 1-9 or click the hotbar</p>
    </div>
  )
}

export function Profile({ go }) {
  return (
    <>
      <Title>Player Profile</Title>
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="slot-dark hidden h-[132px] w-[132px] shrink-0 place-items-center self-start overflow-hidden md:grid">
          <img src={me.head} alt={`${me.full}'s character`} className="px w-[86%]" />
        </div>
        <div className="flex-1">
          <p className="mb-4 text-[13px] leading-relaxed text-[#dcdcdc]">{me.bio}</p>
          <Stagger>
            {me.stats.map(([k, v]) => (
              <Item key={k} className="flex justify-between gap-4 border-b-2 border-white/[.07] py-2 text-[13px]">
                <span className="text-[#f0f0f0]">{k}</span>
                <span className={k === 'Status' ? 'text-[#55ff55]' : 'text-[var(--gray)]'}>{v}</span>
              </Item>
            ))}
          </Stagger>
          <Btn className="mt-5" onClick={() => go(5)}>View Journey</Btn>
        </div>
      </div>
    </>
  )
}

export function Skills() {
  const tip = useTip()
  return (
    <>
      <Title>Enchantments</Title>
      <Stagger className="flex flex-col gap-1.5">
        {skills.map(s => (
          <Item key={s.name} tabIndex={0} {...tip({ title: `${s.name} ${s.lvl}`, lore: s.lore, color: '#55ffff' })}
            className="row grid grid-cols-[22px_1fr_56px_26px] items-center gap-2 px-2.5 py-2 text-[12px] sm:grid-cols-[34px_1fr_1.1fr_34px] sm:gap-3 sm:px-3 sm:text-[13px]">
            <span className="font-bold text-[#ffcf4a]">{s.lvl}</span>
            <span className="truncate">{s.name}</span>
            <span className="h-[7px] bg-black/60">
              <m.span className="block h-full bg-gradient-to-r from-[#3fd0d0] to-[#a0f0ff] shadow-[0_0_10px_rgba(80,230,255,.45)]"
                initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: .9, delay: .2, ease: [0.22, 1, 0.36, 1] }} />
            </span>
            <span className="text-right text-[#55ff55]">{s.pct}</span>
          </Item>
        ))}
      </Stagger>
      <Hint>Hover an enchantment to inspect it</Hint>
    </>
  )
}

export function Builds({ go }) {
  const tip = useTip()
  const [sel, setSel] = useState(null)
  const cells = [...projects, ...Array(12 - projects.length).fill(null)]
  const p = projects[sel]
  return (
    <>
      <Title>Chest — Completed Builds</Title>
      <Stagger className="grid grid-cols-6 gap-1">
        {cells.map((c, i) => c ? (
          <Item key={i}>
            <button aria-label={c.title} onClick={() => { play('click'); setSel(i) }}
              {...tip({ title: c.title, lore: c.tags.join(' · '), color: c.rarity, hint: 'Click for details' })}
              className={`slot-dark relative grid aspect-square w-full place-items-center ${sel === i ? 'outline outline-2 outline-white' : ''}`}>
              <Pixel icon={c.icon} size={34} className="drop-shadow-[2px_2px_0_rgba(0,0,0,.4)]" />
              <span className="absolute bottom-1 right-1 h-1.5 w-1.5" style={{ background: c.rarity }} />
            </button>
          </Item>
        ) : <Item key={i} className="slot-dark aspect-square" />)}
      </Stagger>
      {p ? (
        <m.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="row mt-3 p-3">
          <div className="ts text-[15px]" style={{ color: p.rarity }}>{p.title}</div>
          <p className="mt-1 text-[12px] leading-relaxed text-[#d4d4d4]">{p.desc}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.tags.map(t => <span key={t} className="border border-[#3a0a8a] bg-black/40 px-2 py-0.5 text-[11px] text-[#aaaaff]">{t}</span>)}
          </div>
          {p.link && (
            <a href={p.link} target="_blank" rel="noreferrer" onClick={() => play('click')}
              className="mc-btn mt-3 inline-flex h-9 items-center gap-2 px-4 text-[13px]">Open <Ico name="external" size={13} /></a>
          )}
        </m.div>
      ) : <Hint>Hover an item for details</Hint>}
      <Btn className="mt-4" onClick={() => go(7)}>See Trades</Btn>
    </>
  )
}

export function Journey() {
  const tip = useTip()
  return (
    <>
      <Title>Crafting — The Journey</Title>
      <Stagger className="flex flex-col">
        {journey.map((j, i) => (
          <Item key={i} className="flex items-center gap-3 border-b-2 border-white/[.07] py-3 last:border-0">
            <div className="flex shrink-0 gap-1">
              {j.items.map((it, k) => (
                <div key={k} className="slot-dark grid h-9 w-9 place-items-center"><Pixel icon={it} size={22} /></div>
              ))}
            </div>
            <Ico name="arrow" className="shrink-0 text-[#8a8a8a]" size={16} />
            <div className="min-w-0" tabIndex={0} {...tip({ title: j.title, lore: j.desc, color: '#ffff55' })}>
              <div className="text-[11px] text-[var(--dim)]">{j.when}</div>
              <div className="ts text-[14px] font-bold text-white">{j.title}</div>
              <div className="text-[12px] leading-snug text-[#c8c8c8]">{j.desc}</div>
            </div>
          </Item>
        ))}
      </Stagger>
    </>
  )
}

export function Advancements({ go }) {
  return (
    <>
      <Title>Advancements</Title>
      <Stagger className="flex flex-col gap-1.5">
        {advancements.map(a => (
          <Item key={a.title} className={`row flex items-center gap-3 p-2 ${a.locked ? 'opacity-45' : ''}`}>
            <div className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[#c6a24a] bg-black/40 shadow-[inset_0_0_0_2px_#000]">
              <Pixel icon={a.icon} size={24} className={a.locked ? 'grayscale' : ''} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-white">{a.title}</div>
              <div className="truncate text-[11px] italic text-[var(--gray)]">{a.desc}</div>
            </div>
            {!a.locked && <Ico name="check" size={16} className="shrink-0 text-[#55ff55]" />}
          </Item>
        ))}
      </Stagger>
      <Btn className="mt-4" onClick={() => go(8)}>Send a Message</Btn>
    </>
  )
}

export function Trades({ go }) {
  const tip = useTip()
  return (
    <>
      <Title right="Master Builder · Level 5">Villager Trades</Title>
      <Stagger className="flex flex-col gap-1.5">
        {trades.map(t => (
          <Item key={t.title}>
            <button onClick={() => { play('levelup'); go(8) }} {...tip({ title: t.title, lore: t.desc, color: '#55ff55', hint: 'Click to trade' })}
              className="row flex w-full items-center gap-3 px-3 py-2 text-left">
              <Pixel icon={I.emerald} size={20} />
              <span className="w-6 text-[13px]">{t.cost}</span>
              <Ico name="arrow" size={14} className="text-[#777]" />
              <Pixel icon={t.icon} size={20} />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-white">{t.title}</span>
                <span className="block truncate text-[11px] italic text-[var(--gray)]">{t.desc}</span>
              </span>
              <span className={`text-[11px] ${t.stock === 'Limited' ? 'text-[#ffaa00]' : 'text-[#55ff55]'}`}>{t.stock}</span>
            </button>
          </Item>
        ))}
      </Stagger>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {tradeStats.map(([n, l]) => (
          <div key={l} className="row py-2 text-center">
            <div className="ts text-[18px] font-bold">{n}</div>
            <div className="text-[10px] tracking-widest text-[var(--gray)]">{l.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <Btn className="mt-4" onClick={() => go(8)}>Make an Offer</Btn>
    </>
  )
}

function LinkRow({ l }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(l.copy)
      setCopied(true); play('pop')
      setTimeout(() => setCopied(false), 1400)
    } catch { location.href = `mailto:${l.copy}` }
  }
  const body = (
    <>
      <Pixel icon={l.icon} size={22} />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] tracking-[.2em] opacity-60">{l.label.toUpperCase()}</span>
        <span className="block truncate text-[14px]">{l.value}</span>
      </span>
      {l.copy && (copied ? <Ico name="check" size={15} className="text-[#2a7a2a]" /> : <Ico name="copy" size={15} className="opacity-50" />)}
      {l.href && <Ico name="external" size={15} className="opacity-50" />}
    </>
  )
  const cls = 'row flex w-full items-center gap-3 px-1 py-2.5 text-left'
  if (l.href) return <a href={l.href} target="_blank" rel="noreferrer" onClick={() => play('click')} className={cls}>{body}</a>
  if (l.copy) return <button onClick={copy} className={cls} aria-label={`Copy ${l.label}`}>{body}</button>
  return <div className={cls}>{body}</div>
}

export function Contact({ go }) {
  return (
    <>
      <h2 className="text-[20px] font-bold">Let's Connect</h2>
      <p className="mb-3 mt-1 text-[12px] italic opacity-70">Send word and I will answer within 48 hours.</p>
      <Stagger>
        {links.map(l => <Item key={l.label}><LinkRow l={l} /></Item>)}
      </Stagger>
      <p className="mt-3 text-right text-[11px] opacity-60">Page 1 of 1</p>
      <Btn className="mt-3" onClick={() => go(9)}>To The End</Btn>
    </>
  )
}

export function End({ go }) {
  return (
    <div className="flex flex-col items-center bg-[radial-gradient(ellipse_at_center,rgba(12,0,24,.72)_0%,rgba(12,0,24,.45)_45%,transparent_72%)] px-10 py-12 text-center sm:px-24">
      <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
        className="ts text-[11px] tracking-[.4em] text-[#c79bff]">THANKS FOR PLAYING</m.p>
      <m.h2 initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}
        className="logo mt-2 text-[52px] leading-none sm:text-[76px]">The End</m.h2>
      <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }}
        className="ts mt-5 space-y-1 text-[13px] text-[#e0d4ff]">
        <p>You made it to the edge of the world.</p>
        <p className="text-[#b9a6e0]">Every world starts with a seed —</p>
        <p className="text-[#b9a6e0]">let's plant the next one together.</p>
      </m.div>
      <div className="mt-6 flex gap-2.5">
        <Btn onClick={() => go(1)}>Respawn</Btn>
        <Btn onClick={() => go(8)}>Contact</Btn>
      </div>
    </div>
  )
}
