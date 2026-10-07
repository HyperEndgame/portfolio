// Minecraft-style hover tooltip. Plays hover tick on enter.
import { useState } from 'react'
import { play } from '../sound'

export default function Tip({ title, lore, color = '#ffffff', children, className = '' }) {
  const [show, setShow] = useState(false)
  const on = () => { setShow(true); play('hover') }
  return (
    <div className={`relative ${className}`} onMouseEnter={on} onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && (
        <div role="tooltip" className="mc-tip pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[240px] -translate-x-1/2 px-2 py-1.5 text-left text-sm leading-tight">
          <div className="ts" style={{ color }}>{title}</div>
          {lore && <div className="ts mt-0.5 text-[#a8a8ff]">{lore}</div>}
        </div>
      )}
    </div>
  )
}
