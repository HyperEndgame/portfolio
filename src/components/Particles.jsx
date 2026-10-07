// Full-screen canvas of square pixel particles; style depends on biome fx.
import { useEffect, useRef } from 'react'

const FX = {
  petals: { n: 70, c: ['#ffb6d5', '#ff9cc6', '#ffd6e8'], vx: [0.4, 1.2], vy: [0.4, 1], s: [3, 6], wind: 1 },
  snow: { n: 110, c: ['#ffffff', '#e8f0ff'], vx: [-0.2, 0.3], vy: [0.6, 1.4], s: [2, 4], wind: 0.5 },
  pollen: { n: 35, c: ['#fff6a0', '#ffffff'], vx: [-0.2, 0.3], vy: [-0.15, 0.15], s: [2, 3], wind: 0.3, glow: true },
  leaves: { n: 40, c: ['#a0c858', '#80a840', '#d8e070'], vx: [0.2, 0.8], vy: [0.4, 0.9], s: [3, 5], wind: 0.8 },
  embers: { n: 60, c: ['#ffa030', '#ff6010', '#ffd060'], vx: [-0.3, 0.3], vy: [-1.2, -0.4], s: [2, 4], wind: 0.4, glow: true },
  dust: { n: 40, c: ['#c8b090', '#a08a6a'], vx: [-0.1, 0.1], vy: [0.05, 0.25], s: [2, 3], wind: 0.2 },
  magic: { n: 60, c: ['#c080ff', '#ff80ff', '#8060ff'], vx: [-0.3, 0.3], vy: [-0.8, -0.2], s: [2, 4], wind: 0.3, glow: true },
}

const rand = ([a, b]) => a + Math.random() * (b - a)

export default function Particles({ fx }) {
  const ref = useRef()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cfg = FX[fx]
    const cv = ref.current, cx = cv.getContext('2d')
    let w, h, raf, t = 0
    const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight }
    size()
    addEventListener('resize', size)
    const make = (edge) => ({
      x: Math.random() * w,
      y: edge ? (cfg.vy[1] < 0 ? h + 10 : -10) : Math.random() * h,
      vx: rand(cfg.vx), vy: rand(cfg.vy), s: Math.round(rand(cfg.s)),
      c: cfg.c[Math.floor(Math.random() * cfg.c.length)], p: Math.random() * 6.28,
    })
    const ps = Array.from({ length: cfg.n }, () => make(false))
    const tick = () => {
      t += 0.01
      cx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx + Math.sin(t * 2 + p.p) * cfg.wind * 0.6
        p.y += p.vy
        if (p.y > h + 20 || p.y < -20 || p.x > w + 20 || p.x < -20) Object.assign(p, make(true))
        cx.globalAlpha = cfg.glow ? 0.5 + Math.sin(t * 5 + p.p) * 0.5 : 0.9
        cx.fillStyle = p.c
        cx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s)
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); cx.clearRect(0, 0, w, h) }
  }, [fx])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true" />
}
