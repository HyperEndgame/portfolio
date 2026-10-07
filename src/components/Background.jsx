// Full-bleed biome photo: crossfade + Ken Burns + mouse parallax + anchored ambience.
import { useEffect, useRef, useState } from 'react'
import Ambience from './Ambience'
import { scenes, photo } from '../data'

function useParallax(on) {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) ref.current.style.transform = ''
    if (!on || matchMedia('(pointer: coarse)').matches) return
    let raf
    const move = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / innerWidth - .5) * -18
        const y = (e.clientY / innerHeight - .5) * -12
        if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    addEventListener('mousemove', move)
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [on])
  return ref
}

function useSize() {
  const [s, setS] = useState({ w: innerWidth, h: innerHeight })
  useEffect(() => {
    const r = () => setS({ w: innerWidth, h: innerHeight })
    addEventListener('resize', r)
    return () => removeEventListener('resize', r)
  }, [])
  return s
}

// CSS object-fit: cover math, so overlays can be pinned to image coordinates
// (container is 48px larger than the viewport: parallax bleed)
function cover({ w, h }, [iw, ih], pos, zoom) {
  const [px, py] = pos.split(' ').map(v => parseFloat(v) / 100)
  const W = w + 48, H = h + 48
  const k = Math.max(W / iw, H / ih) * zoom
  const dw = iw * k, dh = ih * k
  return { width: dw, height: dh, left: (W - dw) * px, top: (H - dh) * py }
}

// photo fades in once decoded; its ambience waits so lights never float over black
function Photo({ src, filter, scene, onReady }) {
  const [ready, setReady] = useState(false)
  const ref = useRef()
  useEffect(() => { if (ref.current?.complete) setReady(true) }, [])
  useEffect(() => { if (ready) onReady?.() }, [ready])
  return (
    <>
      <img ref={ref} src={photo(src)}
        alt="" decoding="async" draggable="false" onLoad={() => setReady(true)}
        className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} style={{ filter }} />
      {ready && <Ambience scene={scene} />}
    </>
  )
}

function Layer({ biome, size, onReady }) {
  const { src, pos = '50% 50%', zoom = 1, filter = 'none' } = biome
  const scene = scenes[src.split('/').pop()] || { size: [1920, 1080] }
  return (
    <div className="kenburns absolute inset-0" style={{ transformOrigin: pos }}>
      <div className="absolute" style={cover(size, scene.size, pos, zoom)}>
        <Photo src={src} filter={filter} scene={scene} onReady={onReady} />
      </div>
    </div>
  )
}

const id = (b) => b.src + (b.pos || '')

// the last photo that actually got on screen stays underneath until the new one
// has decoded and faded in: switching never shows black
function useLayers(biome) {
  const [, force] = useState(0)
  const r = useRef({ top: biome, base: biome, ready: null }).current
  if (id(r.top) !== id(biome)) {
    if (r.ready === id(r.top)) r.base = r.top
    r.top = biome
  }
  const ready = () => {
    r.ready = id(biome)
    setTimeout(() => { if (id(r.top) === id(biome)) { r.base = biome; force(n => n + 1) } }, 800)
  }
  return [r.base, ready]
}

export default function Background({ biome, side, parallax }) {
  const par = useParallax(parallax)
  const size = useSize()
  const [base, ready] = useLayers(biome)
  const shade = side === 'right'
    ? 'linear-gradient(270deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, transparent 70%)'
    : 'linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, transparent 70%)'
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <div ref={par} className="absolute -inset-6 transition-transform duration-300 ease-out">
        {[id(base) !== id(biome) && <Layer key={id(base)} biome={base} size={size} />,
          <Layer key={id(biome)} biome={biome} size={size} onReady={ready} />]}
      </div>
      <div className="pointer-events-none absolute inset-0 transition-[background] duration-700" style={{ background: shade }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
    </div>
  )
}
