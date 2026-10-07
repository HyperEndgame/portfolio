// "Mine for the Amulet": click blocks 3x to break; one hides the amulet.
import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import Pixel from './Pixel'
import { play } from '../sound'
import { stone, ore, dirt, amulet } from '../icons'

const N = 20, HITS = 3

function makeGrid() {
  const prize = Math.floor(Math.random() * N)
  return Array.from({ length: N }, (_, i) => ({
    icon: i < 5 ? dirt : Math.random() < 0.15 ? ore : stone, hits: 0, prize: i === prize,
  }))
}

export default function Game({ close, win }) {
  const start = useMemo(makeGrid, [])
  const [grid, setGrid] = useState(start)
  const [found, setFound] = useState(false)

  const hit = (i) => {
    const b = grid[i]
    if (b.hits >= HITS || found) return
    const hits = b.hits + 1
    setGrid(g => g.map((x, k) => k === i ? { ...x, hits } : x))
    if (hits < HITS) return play('hit')
    play('break')
    if (b.prize) { setFound(true); play('levelup'); win() }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-label="Mine for the Amulet">
      <div className="mc-panel w-full max-w-md p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="ts text-lg">Mine for the Amulet</h2>
          <button onClick={() => { play('click'); close() }} aria-label="Close" className="mc-btn grid h-8 w-8 place-items-center"><X size={16} /></button>
        </div>
        <p className="mb-3 text-xs text-mcgray">{found ? 'Advancement made! The Amulet is yours.' : 'Click a block three times to break it. One hides the amulet.'}</p>
        <div className="grid grid-cols-5 gap-1">
          {grid.map((b, i) => {
            const broken = b.hits >= HITS
            return (
              <button key={i} onClick={() => hit(i)} aria-label={broken ? 'Broken block' : 'Block'}
                className={`relative aspect-square ${broken ? 'bg-black/50 shadow-[inset_2px_2px_0_#000]' : 'active:scale-95'}`}>
                {broken
                  ? b.prize && <motion.div initial={{ scale: 0, y: 8 }} animate={{ scale: 1, y: 0 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}><Pixel icon={amulet} size="70%" className="mx-auto" /></motion.div>
                  : <>
                      <Pixel icon={b.icon} size="100%" />
                      {b.hits > 0 && <span className="crack absolute inset-0" style={{ opacity: b.hits / HITS }} />}
                    </>}
              </button>
            )
          })}
        </div>
        {found && <button onClick={() => { setGrid(makeGrid()); setFound(false); play('click') }} className="mc-btn mt-3 h-10 w-full">Mine Again</button>}
      </div>
    </div>
  )
}
