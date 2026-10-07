// Player render (front or back view) with idle bob, ground shadow and enter slide.
import { AnimatePresence, m } from 'framer-motion'
import { me } from '../data'

export default function Player({ view = 'front', side = 'right', slot }) {
  const src = view === 'back' ? me.avatarBack : me.avatar
  const pos = side === 'left' ? 'left-[6vw]' : 'right-[5vw]'
  return (
    <div className={`pointer-events-none absolute bottom-[118px] z-20 hidden h-[66vh] max-h-[640px] md:block ${pos}`} aria-hidden="true">
      <AnimatePresence mode="wait">
        <m.div key={view + side + (slot === 1)} className="relative h-full"
          initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
          transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
          <div className="absolute -bottom-2 left-1/2 h-5 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
          <div className="bob relative h-full"><img src={src} alt="" draggable="false" className="px breathe h-full w-auto drop-shadow-[0_12px_24px_rgba(0,0,0,.45)]" /></div>
        </m.div>
      </AnimatePresence>
    </div>
  )
}
