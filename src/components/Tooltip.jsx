// Cursor-following game tooltip. Wrap the app in <TipProvider>, spread tip({...}) on any element.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { play } from '../sound'

const Ctx = createContext(() => ({}))
export const useTip = () => useContext(Ctx)

export function TipProvider({ children, reset }) {
  const [tip, setTip] = useState(null)
  const box = useRef()

  // the hovered element may unmount (screen change) without firing mouseleave
  useEffect(() => setTip(null), [reset])

  useEffect(() => {
    const move = (e) => {
      const el = box.current
      if (!el) return
      const x = Math.min(e.clientX + 16, innerWidth - el.offsetWidth - 8)
      const y = Math.max(8, e.clientY - el.offsetHeight - 12)
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    addEventListener('mousemove', move)
    return () => removeEventListener('mousemove', move)
  }, [])

  // touch screens fire mouseenter on tap and never leave: no tooltips there
  const touch = useRef(matchMedia('(hover: none)').matches).current
  const bind = useCallback((t) => touch ? {} : ({
    onMouseEnter: () => { setTip(t); play('hover') },
    onMouseLeave: () => setTip(null),
    onFocus: () => setTip(t),
    onBlur: () => setTip(null),
  }), [touch])

  return (
    <Ctx.Provider value={bind}>
      {children}
      <div ref={box} role="tooltip" aria-hidden={!tip}
        className={`tip pointer-events-none fixed left-0 top-0 z-[90] max-w-[280px] px-2.5 py-2 text-[13px] leading-snug transition-opacity duration-100 ${tip ? 'opacity-100' : 'opacity-0'}`}>
        {tip && <>
          <div className="ts-sm" style={{ color: tip.color || '#fff' }}>{tip.title}</div>
          {tip.lore && <div className="ts-sm mt-1 text-[#aaaaff]">{tip.lore}</div>}
          {tip.hint && <div className="ts-sm mt-1 text-[#7c7c7c]">{tip.hint}</div>}
        </>}
      </div>
    </Ctx.Provider>
  )
}
