// Canvas particles per biome: petals, fireflies, motes, enchant glyphs, end sparks.
import { useEffect, useMemo, useRef } from 'react'

const FX = {
  petals: { n: 42, c: ['#ffb7d2', '#ff9ec4', '#ffd0e2', '#f6a8c8'], vx: [.4, 1.2], vy: [.5, 1.1], s: [12, 20], kind: 'petal' },
  fireflies: { n: 38, c: ['#ffe27a', '#fff2b0', '#ffd04a'], vx: [-.25, .25], vy: [-.3, .1], s: [2, 3], kind: 'glow' },
  motes: { n: 40, c: ['#ffffff', '#fff6d8'], vx: [-.15, .25], vy: [-.12, .12], s: [2, 3], kind: 'glow' },
  glyphs: { n: 26, c: ['#d7a8ff', '#b07cff', '#f0d4ff'], vx: [-.2, .2], vy: [-.55, -.2], s: [10, 14], kind: 'glyph' },
  end: { n: 70, c: ['#e3a6ff', '#b46cff', '#ffffff'], vx: [-.15, .15], vy: [-.6, -.15], s: [2, 4], kind: 'glow' },
}

// tiny 3x5 rune bitmaps (original, enchant-table flavour)
const RUNES = ['111101111', '010111010', '110011110', '101010101', '111100111', '011110011', '100111001', '010101111']

const rand = ([a, b]) => a + Math.random() * (b - a)

// blocky petal: 5x5 pixel sprite, drawn scaled up with no smoothing
const PETAL = ['.LL..', 'LPPP.', 'PPPPD', '.PPDD', '..DD.']
const sprites = {}
function petal(color) {
  if (sprites[color]) return sprites[color]
  const c = document.createElement('canvas'), x = c.getContext('2d')
  c.width = c.height = 5
  const pal = { L: '#ffe4ef', P: color, D: '#e483aa' }
  PETAL.forEach((row, y) => [...row].forEach((ch, i) => {
    if (pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i, y, 1, 1) }
  }))
  return (sprites[color] = c)
}

// rune as a 3x5 sprite (rows 0, 2, 4) for the CSS version
function rune(bits, color) {
  const c = document.createElement('canvas'), x = c.getContext('2d')
  c.width = 3; c.height = 5; x.fillStyle = color
  for (let i = 0; i < 9; i++) if (bits[i] === '1') x.fillRect(i % 3, (i / 3 | 0) * 2, 1, 1)
  return c
}

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
    // game-style: no smooth spin, just a stepped flip as it flutters down
    const flip = Math.cos(t * 2 + p.p) > 0 ? 1 : -1
    cx.imageSmoothingEnabled = false
    cx.setTransform(flip, 0, 0, 1, Math.round(p.x), Math.round(p.y))
    cx.globalAlpha = 1
    cx.drawImage(petal(p.c), -p.s / 2, -p.s / 2, p.s, p.s)
    cx.setTransform(1, 0, 0, 1, 0, 0)
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

function CanvasParticles({ fx, near }) {
  const ref = useRef()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const base = FX[fx], cv = ref.current, cx = cv.getContext('2d')
    // near layer: a few big, fast, out-of-focus particles for depth
    const cfg = near ? { ...base, n: base.n / 4 | 0, s: base.s.map(v => v * 2.6), vx: base.vx.map(v => v * 1.8), vy: base.vy.map(v => v * 1.8) } : base
    let w = 0, h, raf, t = 0, last = 0
    const size = () => {
      // phones fire resize when the address bar slides: only rebuild on width change
      if (innerWidth === w && innerHeight <= h) return
      w = innerWidth; h = Math.max(innerHeight, h || 0)
      cv.width = w; cv.height = h // pixel art: 1x canvas, upscaled with image-rendering: pixelated
    }
    size()
    addEventListener('resize', size)
    const ps = Array.from({ length: cfg.n }, () => spawn(cfg, w, h, true))
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      // time-based step: same speed at any frame rate, clamped after tab switches
      const k = last ? Math.min((now - last) / (1000 / 60), 4) : 1
      last = now
      t += k / 60
      cx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += (p.vx + Math.sin(t + p.p) * .35) * k
        p.y += p.vy * k
        if (p.y > h + 30 || p.y < -30 || p.x > w + 30 || p.x < -30) Object.assign(p, spawn(cfg, w, h, false))
        draw(cx, cfg, p, t)
      }
      cx.globalAlpha = 1
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [fx, near])
  return <canvas ref={ref} style={{ imageRendering: 'pixelated' }} className={`pointer-events-none absolute left-0 top-0 ${near ? 'z-[46] opacity-60' : 'z-10'}`} aria-hidden="true" />
}

// phones: a handful of tiny sprites on CSS keyframes. The compositor moves them,
// so there is no per-frame JS and no full-screen canvas to repaint and upload.
function CssParticles({ fx }) {
  const items = useMemo(() => {
    const cfg = FX[fx], h = innerHeight + 60
    return Array.from({ length: Math.ceil(cfg.n / 3) }, (_, i) => {
      const p = spawn(cfg, innerWidth, h, true)
      const vy = (cfg.vy[0] + cfg.vy[1]) / 2
      const dur = h / (Math.max(Math.abs(p.vy), .15) * 60)
      const dx = Math.max(-.6, Math.min(.6, p.vx * 60 * dur / innerWidth)) * innerWidth // keep drift on screen
      const img = cfg.kind === 'petal' ? petal(p.c) : cfg.kind === 'glyph' ? rune(p.r, p.c) : null
      return {
        key: i, cls: `pt ${vy < 0 ? 'pt-up' : ''}`,
        style: { left: p.x - dx / 2, '--dx': `${dx}px`, animationDuration: `${dur}s`, animationDelay: `${-Math.random() * dur}s` },
        inner: {
          width: p.s, height: img ? p.s * img.height / img.width : p.s,
          background: img ? `url(${img.toDataURL()}) 0 0 / 100% 100%` : p.c, color: p.c,
          animationDuration: `${2 + Math.random() * 2}s`, animationDelay: `${-Math.random() * 4}s`,
        },
        glow: !img,
      }
    })
  }, [fx])
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {items.map(p => <div key={p.key} className={p.cls} style={p.style}><i className={p.glow ? 'pt-glow' : 'pt-sway'} style={p.inner} /></div>)}
    </div>
  )
}

const PHONE = matchMedia('(max-width: 767px)').matches

export default function Particles({ fx, near = false }) {
  return PHONE ? <CssParticles fx={fx} /> : <CanvasParticles fx={fx} near={near} />
}
