// Full-bleed biome photo: crossfade + Ken Burns + mouse parallax + light rays.
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function useParallax() {
  const ref = useRef()
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
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
  }, [])
  return ref
}

export default function Background({ biome, side }) {
  const par = useParallax()
  const { src, pos = '50% 50%', zoom = 1, filter = 'none', rays } = biome
  const shade = side === 'right'
    ? 'linear-gradient(270deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, transparent 70%)'
    : 'linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.15) 45%, transparent 70%)'
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" aria-hidden="true">
      <div ref={par} className="absolute -inset-6 transition-transform duration-300 ease-out">
        <AnimatePresence initial={false}>
          <motion.div key={src + pos} className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="kenburns absolute inset-0">
              <img src={src} alt="" decoding="async" draggable="false"
                className="h-full w-full object-cover"
                style={{ objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos, filter }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {rays && <div className="rays pointer-events-none absolute inset-0" />}
      <div className="pointer-events-none absolute inset-0 transition-[background] duration-700" style={{ background: shade }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,.55)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
    </div>
  )
}
