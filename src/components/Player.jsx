// Placeholder player. Pass `children` (e.g. an R3F <Canvas>) or `src` (PNG) to replace it.
import { motion } from 'framer-motion'
import Pixel from './Pixel'
import { head, pickaxe } from '../icons'

const SHIRT = '#2a3550', STRIPE = '#e8892a', SKIN = '#c68a5a', PANTS = '#3a3a46', SHOE = '#1a1a1a'

function Body() {
  // 16 x 32 unit blocky figure (original design)
  return (
    <svg className="px w-full h-full" viewBox="0 0 16 32" aria-hidden="true">
      <rect x="4" y="8" width="8" height="12" fill={SHIRT} />
      <rect x="4" y="12" width="8" height="1" fill={STRIPE} />
      <rect x="0" y="8" width="4" height="4" fill={SHIRT} />
      <rect x="12" y="8" width="4" height="4" fill={SHIRT} />
      <rect x="0" y="12" width="4" height="8" fill={SKIN} />
      <rect x="12" y="12" width="4" height="8" fill={SKIN} />
      <rect x="4" y="20" width="4" height="10" fill={PANTS} />
      <rect x="8" y="20" width="4" height="10" fill="#33333e" />
      <rect x="4" y="30" width="8" height="2" fill={SHOE} />
    </svg>
  )
}

export default function Player({ src, children }) {
  return (
    <div className="pointer-events-none absolute bottom-24 right-[4vw] z-20 hidden h-[62vh] max-h-[560px] aspect-[1/2] md:block">
      {children ?? (src ? <img src={src} alt="Player character" className="h-full w-full object-contain [image-rendering:pixelated]" /> : (
        <motion.div className="relative h-full w-full drop-shadow-[8px_8px_0_rgba(0,0,0,.35)]"
          animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="absolute left-1/4 top-0 w-1/2"><Pixel icon={head} size="100%" /></div>
          <div className="absolute inset-0"><Body /></div>
          <motion.div className="absolute left-[-14%] top-[46%] w-[40%] origin-bottom-right"
            animate={{ rotate: [-30, -18, -30] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Pixel icon={pickaxe} size="100%" />
          </motion.div>
        </motion.div>
      ))}
      {[...Array(8)].map((_, i) => (
        <motion.span key={i} className="absolute h-2 w-2 bg-yellow-200"
          style={{ left: `${10 + (i * 37) % 80}%`, top: `${15 + (i * 53) % 70}%` }}
          animate={{ opacity: [0, 1, 0], y: [0, -20] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.4 }} />
      ))}
    </div>
  )
}
