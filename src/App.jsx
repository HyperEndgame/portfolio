import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Biome from './components/Biome'
import Particles from './components/Particles'
import Player from './components/Player'
import Game from './components/Game'
import { Info, SoundToggle, Hotbar } from './components/Hud'
import * as S from './components/Screens'
import { biomes } from './data'
import { play, isOn, setOn } from './sound'

export default function App() {
  const [slot, setSlot] = useState(1)
  const [sound, setSound] = useState(isOn)
  const [panel, setPanel] = useState(true) // mobile drawer open
  const [vitals, setVitals] = useState(true)
  const [game, setGame] = useState(false)
  const [amulet, setAmulet] = useState(false)
  const [toast, setToast] = useState(null)

  const go = useCallback((n) => { play('click'); setSlot(n); setPanel(true) }, [])
  const toggleSound = useCallback(() => setSound(v => { setOn(!v); return !v }), [])

  useEffect(() => {
    const key = (e) => {
      if (e.target.closest('input, textarea') || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key >= '1' && e.key <= '9') go(Number(e.key))
      else if (e.key.toLowerCase() === 'm') toggleSound()
      else if (e.key === 'Escape') setGame(false)
    }
    addEventListener('keydown', key)
    return () => removeEventListener('keydown', key)
  }, [go, toggleSound])

  const win = () => {
    setAmulet(true)
    setToast('The Amulet')
    setTimeout(() => setToast(null), 3500)
  }

  const b = biomes[slot]
  const screens = {
    2: <S.Profile go={go} />, 3: <S.Skills />, 4: <S.Builds />, 5: <S.Journey />,
    6: <S.Advancements unlocked={amulet} />, 7: <S.Trades go={go} />, 8: <S.Contact />, 9: <S.End />,
  }

  return (
    <main className="relative h-full w-full select-none overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div key={b.scene} className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <Biome scene={b.scene} />
        </motion.div>
      </AnimatePresence>
      <Particles fx={b.fx} />

      <Info biome={b.name} />
      <SoundToggle on={sound} toggle={toggleSound} />
      {slot !== 1 && <Player />}

      <AnimatePresence mode="wait">
        {slot === 1 ? (
          <motion.section key="menu" className="absolute inset-0 z-30 flex items-center justify-center px-4 pb-32"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
            <S.Menu go={go} mine={() => { play('click'); setGame(true) }} />
          </motion.section>
        ) : panel && (
          <motion.section key={slot}
            className="mc-panel fixed inset-0 z-[45] overflow-y-auto p-5 pb-36 pt-16 md:absolute md:inset-auto md:left-[5vw] md:top-[12vh] md:max-h-[calc(88vh-170px)] md:w-[min(560px,48vw)] md:p-6"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <button onClick={() => { play('click'); setPanel(false) }} aria-label="Close panel"
              className="mc-btn absolute right-3 top-3 grid h-9 w-9 place-items-center md:hidden"><X size={16} /></button>
            {screens[slot]}
          </motion.section>
        )}
      </AnimatePresence>

      <Hotbar slot={slot} go={go} open={vitals} setOpen={setVitals} />

      {game && <Game close={() => setGame(false)} win={win} />}

      <AnimatePresence>
        {toast && (
          <motion.div className="fixed right-3 top-16 z-[60] flex items-center gap-3 border-2 border-black bg-[#212121] p-3 shadow-[inset_2px_2px_0_#3a3a3a]"
            initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} role="status">
            <div>
              <div className="text-sm text-[#ff55ff]">Challenge Complete!</div>
              <div className="text-sm">{toast}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="ts pointer-events-none absolute bottom-1 left-2 z-20 hidden text-[10px] text-white/50 lg:block">
        Built by Rohtak · not affiliated with Mojang
      </p>
    </main>
  )
}
