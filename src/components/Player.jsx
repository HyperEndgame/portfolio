// Player render (front or back view) with idle bob, ground shadow and enter slide. Also Kylo, the dog.
import { m } from 'framer-motion'
import { me } from '../data'

// Minecraft-style floating nametag
const Tag = ({ children, className = '' }) => (
  <div className={`ts-sm glass absolute whitespace-nowrap bg-black/40 px-1.5 py-0.5 text-[11px] text-white md:px-2 ${className}`}>{children}</div>
)

export default function Player({ view = 'front', side = 'right', slot, center }) {
  const src = view === 'back' ? me.avatarBack : me.avatar
  const desk = side === 'left' ? 'md:left-[6vw]' : 'md:left-auto md:right-[5vw]'
  // mobile: centred in the band above the bottom sheet, or tucked top-right on menu/end
  const mob = center ? 'right-3 top-[86px] h-[18vh]' : 'left-1/2 top-[66px] h-[calc(38vh-74px)] -translate-x-1/2'
  return (
    <div className={`pointer-events-none absolute z-20 ${mob} md:top-auto md:bottom-[118px] md:h-[66vh] md:max-h-[640px] md:translate-x-0 ${desk}`} aria-hidden="true">
        <m.div key={view + side + (slot === 1)} className="relative h-full"
          initial={{ opacity: 0, x: side === 'left' ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
          <div className="absolute -bottom-2 left-1/2 h-5 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
          {slot === 1 && (
            <Tag className="-top-7 right-0 md:-top-10 md:left-1/2 md:right-auto md:-translate-x-1/2 md:text-[18px]">{me.tag}</Tag>
          )}
          {slot === 3 && (
            <div className="absolute bottom-0 right-full mr-1 h-[42%]">
              <Tag className="-top-6 left-1/2 -translate-x-1/2 md:-top-9 md:text-[16px]">{me.pet.name}</Tag>
              <img src={me.pet.sit} alt="" draggable="false" className="breathe h-full w-auto max-w-none md:drop-shadow-[0_10px_18px_rgba(0,0,0,.45)]" />
            </div>
          )}
          <div className="bob relative h-full"><img src={src} alt="" draggable="false" className="px breathe h-full w-auto md:drop-shadow-[0_12px_24px_rgba(0,0,0,.45)]" /></div>
        </m.div>
    </div>
  )
}

// Kylo napping under the contact book (desktop only: phones have the sheet there)
export function SleepingDog() {
  return (
    <m.div className="pointer-events-none absolute bottom-[118px] left-[9vw] z-20 hidden h-[13vh] max-h-[130px] md:block" aria-hidden="true"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .2 }}>
      <Tag className="-top-9 left-[38%] -translate-x-1/2 md:text-[16px]">{me.pet.name}</Tag>
      <img src={me.pet.sleep} alt="" draggable="false" className="breathe h-full w-auto max-w-none drop-shadow-[0_10px_18px_rgba(0,0,0,.45)]" />
    </m.div>
  )
}
