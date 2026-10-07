// Full-bleed biome photo: crossfade + Ken Burns + mouse parallax + anchored ambience.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Ambience from './Ambience'
import { scenes } from '../data'

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
function Photo({ src, width, filter, scene }) {
  const [ready, setReady] = useState(false)
  const ref = useRef()
  useEffect(() => { if (ref.current?.complete) setReady(true) }, [])
  return (
    <>
      <img ref={ref} src={src} srcSet={`${src.replace('.webp', '-1280.webp')} 1280w, ${src} 1920w`} sizes={`${Math.round(width)}px`}
        alt="" decoding="async" draggable="false" onLoad={() => setReady(true)}
        className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} style={{ filter }} />
      {ready && <Ambience scene={scene} />}
    </>
  )
}

export default function Background({ biome, side, parallax }) {
  const par = useParallax(parallax)
  const size = useSize()
  const { src, pos = '50% 50%', zoom = 1, filter = 'none' } = biome
  const scene = scenes[src.split('/').pop()] || { size: [1920, 1080] }
  const box = cover({ w: size.w, h: size.h }, scene.size, pos, zoom)
  const shade = side === 'right'
    ? 'linear-gradient(270deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, transparent 70%)'
    : 'linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, transparent 70%)'
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <div ref={par} className="absolute -inset-6 transition-transform duration-300 ease-out">
        <AnimatePresence initial={false}>
          <m.div key={src + pos} className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="kenburns absolute inset-0" style={{ transformOrigin: pos }}>
              <div className="absolute" style={box}>
                <Photo src={src} width={box.width} filter={filter} scene={scene} />
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
      <div className="pointer-events-none absolute inset-0 transition-[background] duration-700" style={{ background: shade }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
    </div>
  )
}
