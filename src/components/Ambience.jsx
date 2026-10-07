// Motion anchored inside a photo (coords are % of the image): pulsing light sources,
// breathing light shafts, water glints and drifting haze. Fakes a video loop.
import { memo } from 'react'

function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

const at = (x, y) => ({ left: `${x}%`, top: `${y}%` })

function Lights({ lights }) {
  return lights.map(([x, y, s, c], i) => (
    <span key={i} className="amb-light" style={{
      ...at(x, y), width: `${s}vmin`, height: `${s}vmin`,
      background: `radial-gradient(circle, ${c} 0%, transparent 65%)`,
      animationDelay: `${(i * 0.37) % 2.4}s`, animationDuration: `${2.2 + (i % 4) * 0.45}s`,
    }} />
  ))
}

function Shafts({ shafts }) {
  return shafts.map((s, k) => [...Array(s.n)].map((_, i) => {
    const ang = s.from + (s.to - s.from) * (i / Math.max(1, s.n - 1))
    return (
      <span key={`${k}-${i}`} className="amb-shaft" style={{
        ...at(s.x, s.y), height: `${s.len}%`, width: `${s.w + (i % 3) * s.w * .6}vmin`,
        transform: `translateX(-50%) rotate(${ang}deg)`,
        background: `linear-gradient(to bottom, ${s.color}, transparent)`,
        animationDelay: `${i * 0.9}s`, animationDuration: `${5 + (i % 3) * 1.5}s`,
      }} />
    )
  }))
}

function Glints({ glints }) {
  return glints.map((g, k) => {
    const r = rng(k + 7)
    return [...Array(g.n)].map((_, i) => (
      <span key={`${k}-${i}`} className="amb-glint" style={{
        ...at(g.x + r() * g.w, g.y + r() * g.h), background: g.color || '#fff',
        animationDelay: `${(r() * 4).toFixed(2)}s`, animationDuration: `${1.6 + r() * 2.2}s`,
      }} />
    ))
  })
}

export default memo(function Ambience({ scene }) {
  if (!scene) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {scene.haze && <div className="amb-haze" style={{ background: scene.haze }} />}
      {scene.shafts && <Shafts shafts={scene.shafts} />}
      {scene.lights && <Lights lights={scene.lights} />}
      {scene.glints && <Glints glints={scene.glints} />}
    </div>
  )
})
