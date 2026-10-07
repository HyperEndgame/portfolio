// Canvas particles per biome: petals, fireflies, embers, motes, enchant glyphs, end sparks.
import { useEffect, useRef } from 'react'

const FX = {
  petals: { n: 55, c: ['#ffc4dd', '#ff9fc7', '#ffe1ee', '#f7b0d0'], vx: [.5, 1.3], vy: [.5, 1.1], s: [4, 7], kind: 'petal' },
  fireflies: { n: 38, c: ['#ffe27a', '#fff2b0', '#ffd04a'], vx: [-.25, .25], vy: [-.3, .1], s: [2, 3], kind: 'glow' },
  embers: { n: 30, c: ['#ffb35c', '#ffd28a', '#ff8a3a'], vx: [-.2, .2], vy: [-.5, -.15], s: [2, 3], kind: 'glow' },
  motes: { n: 40, c: ['#ffffff', '#fff6d8'], vx: [-.15, .25], vy: [-.12, .12], s: [2, 3], kind: 'glow' },
  glyphs: { n: 26, c: ['#d7a8ff', '#b07cff', '#f0d4ff'], vx: [-.2, .2], vy: [-.55, -.2], s: [10, 14], kind: 'glyph' },
  end: { n: 70, c: ['#e3a6ff', '#b46cff', '#ffffff'], vx: [-.15, .15], vy: [-.6, -.15], s: [2, 4], kind: 'glow' },
}

// tiny 3x5 rune bitmaps (original, enchant-table flavour)
const RUNES = ['111101111', '010111010', '110011110', '101010101', '111100111', '011110011', '100111001', '010101111']

const rand = ([a, b]) => a + Math.random() * (b - a)

function spawn(cfg, w, h, fresh) {
  const up = cfg.vy[1] <= 0
  return {
    x: Math.random() * w,
    y: fresh ? Math.random() * h : (up ? h + 20 : -20),
    vx: rand(cfg.vx), vy: rand(cfg.vy), s: rand(cfg.s),
    c: cfg.c[(Math.random() * cfg.c.length) | 0],
    p: Math.random() * 6.28, r: RUNES[(Math.random() * RUNES.length) | 0], rot: Math.random() * 6.28,
  }
}

function draw(cx, cfg, p, t) {
  cx.fillStyle = p.c
  if (cfg.kind === 'petal') {
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot + t * .8)
    cx.globalAlpha = .9
    cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2)
    cx.fillRect(-p.s / 4, -p.s / 2, p.s / 2, p.s)
    cx.restore()
    return
  }
  if (cfg.kind === 'glyph') {
    const u = p.s / 5
    cx.globalAlpha = .35 + .45 * Math.sin(t * 2 + p.p) ** 2
    for (let i = 0; i < 9; i++) if (p.r[i] === '1') cx.fillRect(p.x + (i % 3) * u, p.y + ((i / 3) | 0) * u * 1.6, u, u * 1.4)
    return
  }
  const a = .35 + .65 * Math.sin(t * 2.4 + p.p) ** 2
  cx.globalAlpha = a * .35
  cx.fillRect(p.x - p.s * 1.5, p.y - p.s * 1.5, p.s * 4, p.s * 4)
  cx.globalAlpha = a
  cx.fillRect(p.x, p.y, p.s, p.s)
}

export default function Particles({ fx }) {
  const ref = useRef()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cfg = FX[fx], cv = ref.current, cx = cv.getContext('2d')
    let w, h, raf, t = 0
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2)
      w = innerWidth; h = innerHeight
      cv.width = w * d; cv.height = h * d
      cx.setTransform(d, 0, 0, d, 0, 0)
    }
    size()
    addEventListener('resize', size)
    const ps = Array.from({ length: w < 700 ? cfg.n >> 1 : cfg.n }, () => spawn(cfg, w, h, true))
    const tick = () => {
      t += 1 / 60
      cx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx + Math.sin(t + p.p) * .35
        p.y += p.vy
        if (p.y > h + 30 || p.y < -30 || p.x > w + 30 || p.x < -30) Object.assign(p, spawn(cfg, w, h, false))
        draw(cx, cfg, p, t)
      }
      cx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [fx])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true" />
}
