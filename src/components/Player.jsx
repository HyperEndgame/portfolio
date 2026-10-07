// Player render (front or back view) with idle bob, ground shadow and enter slide.
import { AnimatePresence, m } from 'framer-motion'
import { me } from '../data'

export default function Player({ view = 'front', side = 'right', slot, center }) {
  const src = view === 'back' ? me.avatarBack : me.avatar
  const desk = side === 'left' ? 'md:left-[6vw]' : 'md:left-auto md:right-[5vw]'
  // mobile: centred in the band above the bottom sheet, or tucked top-right on menu/end
  const mob = center ? 'right-3 top-[58px] h-[21vh]' : 'left-1/2 top-[66px] h-[calc(38vh-74px)] -translate-x-1/2'
  return (
    <div className={`pointer-events-none absolute z-20 ${mob} md:top-auto md:bottom-[118px] md:h-[66vh] md:max-h-[640px] md:translate-x-0 ${desk}`} aria-hidden="true">
      <AnimatePresence mode="wait">
        <m.div key={view + side + (slot === 1)} className="relative h-full"
          initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
          transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
          <div className="absolute -bottom-2 left-1/2 h-5 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
          <div className="bob relative h-full"><img src={src} alt="" draggable="false" className="px breathe h-full w-auto md:drop-shadow-[0_12px_24px_rgba(0,0,0,.45)]" /></div>
        </m.div>
      </AnimatePresence>
    </div>
  )
}
