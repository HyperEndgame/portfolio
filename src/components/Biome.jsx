// Procedural blocky scenes per biome (SVG, 160x90 units).
import { memo } from 'react'

const W = 160, H = 90

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// stepped terrain: columns of width `step`
function Ridge({ base, amp, seed, step = 4, fill, cap, capH = 2 }) {
  const cols = []
  for (let x = 0; x < W; x += step) {
    const h = base - amp * (Math.sin(x * 0.045 + seed) * 0.6 + Math.sin(x * 0.11 + seed * 2) * 0.4)
    const y = Math.round(h / 2) * 2
    cols.push(<rect key={x} x={x} y={y} width={step + 0.1} height={H - y} fill={fill} />)
    if (cap) cols.push(<rect key={'c' + x} x={x} y={y} width={step + 0.1} height={capH} fill={cap} />)
  }
  return <g>{cols}</g>
}

function Trees({ seed, y, leaf, leaf2, trunk = '#5a3a1a', n = 8 }) {
  const r = rng(seed)
  return Array.from({ length: n }, (_, i) => {
    const x = Math.floor(r() * 150), s = 4 + Math.floor(r() * 3), t = y + Math.floor(r() * 6)
    return (
      <g key={i}>
        <rect x={x + s / 2 - 0.5} y={t - s} width="1.5" height={s + 1} fill={trunk} />
        <rect x={x} y={t - s * 2} width={s + 1} height={s} fill={leaf} />
        <rect x={x + 1} y={t - s * 2 - 2} width={s - 1} height="2" fill={leaf2} />
      </g>
    )
  })
}

function Sky({ id, stops }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => <stop key={i} offset={i / (stops.length - 1)} stopColor={c} />)}
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id})`} />
    </>
  )
}

function Sun({ x, y, s = 10, c = '#fff6c0', glow = '#ffd070' }) {
  return (
    <g>
      <circle cx={x + s / 2} cy={y + s / 2} r={s * 2.2} fill={glow} opacity=".25" />
      <circle cx={x + s / 2} cy={y + s / 2} r={s * 1.2} fill={glow} opacity=".35" />
      <rect x={x} y={y} width={s} height={s} fill={c} />
    </g>
  )
}

function Clouds({ c = '#fff', o = 0.85 }) {
  return [[8, 6, 18, 60], [20, 14, 26, 90], [5, 22, 14, 75]].map(([y, w, len, dur], i) => (
    <g key={i} className="drift" style={{ animationDuration: `${dur}s`, animationDelay: `-${dur * i / 3}s` }}>
      <rect x="0" y={y} width={len} height="3" fill={c} opacity={o} />
      <rect x="3" y={y - 2} width={w} height="2" fill={c} opacity={o} />
    </g>
  ))
}

function Stars({ seed, n = 50, c = '#fff' }) {
  const r = rng(seed)
  return Array.from({ length: n }, (_, i) =>
    <rect key={i} x={r() * W} y={r() * 60} width=".6" height=".6" fill={c} opacity={0.4 + r() * 0.6} />)
}

// wall of blocks + torches for underground biomes
function Wall({ seed, pal, glow }) {
  const r = rng(seed), b = []
  for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6)
    b.push(<rect key={x + '-' + y} x={x} y={y} width="6.05" height="6.05" fill={pal[Math.floor(r() * pal.length)]} />)
  return (
    <>
      {b}
      <defs>
        <radialGradient id={'g' + seed}>
          <stop offset="0" stopColor={glow} stopOpacity=".55" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      {[[30, 40], [120, 30], [80, 70]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="28" fill={`url(#g${seed})`} />
          <rect x={x - 0.75} y={y} width="1.5" height="5" fill="#6a4a2a" />
          <rect x={x - 1} y={y - 1.5} width="2" height="2" fill="#ffd040" />
        </g>
      ))}
    </>
  )
}

const SCENES = {
  plains: () => (<>
    <Sky id="s1" stops={['#3a6ab0', '#e8a060', '#ffb050', '#ffd890']} />
    <Sun x={34} y={34} s={10} />
    <Clouds c="#ffe0c0" />
    <Ridge base={58} amp={8} seed={1} fill="#6a7aa0" />
    <Ridge base={66} amp={5} seed={3} fill="#4a7a3a" />
    <Trees seed={4} y={66} leaf="#3a6a28" leaf2="#4e8a32" n={9} />
    <Ridge base={76} amp={3} seed={7} fill="#6b4426" cap="#7ab040" />
  </>),
  village: () => (<>
    <Sky id="s7" stops={['#5a9ae8', '#8ac0f0', '#c8e4ff']} />
    <Sun x={120} y={10} s={8} c="#fffbe0" glow="#fff0a0" />
    <Clouds />
    <Ridge base={60} amp={7} seed={11} fill="#7aa0c0" />
    <Ridge base={68} amp={4} seed={13} fill="#5a9a3a" />
    {[20, 60, 100].map(x => (
      <g key={x}>
        <rect x={x} y={62} width="16" height="10" fill="#a07840" />
        <rect x={x - 2} y={58} width="20" height="4" fill="#6a4a2a" />
        <rect x={x + 6} y={66} width="4" height="6" fill="#3a2410" />
      </g>
    ))}
    <Ridge base={78} amp={2} seed={17} fill="#6b4426" cap="#6aaa3a" />
  </>),
  cherry: () => (<>
    <Sky id="s2" stops={['#e8a0c0', '#f8c8d8', '#ffe8f0']} />
    <Clouds c="#fff0f6" />
    <Ridge base={56} amp={8} seed={21} fill="#b8a0c8" />
    <Ridge base={66} amp={5} seed={23} fill="#7a9a5a" />
    <Trees seed={24} y={68} leaf="#f4a0c8" leaf2="#ffc8e0" trunk="#4a2a2a" n={10} />
    <rect x="0" y="76" width={W} height="4" fill="#4a7ab0" opacity=".8" />
    <Ridge base={82} amp={2} seed={27} fill="#5a3a2a" cap="#8ab060" />
  </>),
  snowy: () => (<>
    <Sky id="s5" stops={['#3a5a9a', '#9ab8e0', '#ffd8b0']} />
    <Clouds c="#eef4ff" />
    <Ridge base={44} amp={14} seed={31} step={3} fill="#6a7a9a" cap="#f4f8ff" capH={5} />
    <Ridge base={60} amp={8} seed={33} fill="#3a5a4a" cap="#e8f0ff" />
    <Trees seed={34} y={66} leaf="#1e3e2e" leaf2="#f0f6ff" n={12} />
    <Ridge base={74} amp={3} seed={37} fill="#8a8a9a" cap="#ffffff" capH={3} />
  </>),
  birch: () => (<>
    <Sky id="s8" stops={['#4a8ad8', '#a0d0f0', '#e0f4ff']} />
    <Sun x={20} y={12} s={8} c="#fffbe0" glow="#fff0a0" />
    <Clouds />
    <Ridge base={62} amp={6} seed={41} fill="#5a8a4a" />
    <Trees seed={42} y={70} leaf="#80a840" leaf2="#a0c858" trunk="#e8e8e0" n={14} />
    <Ridge base={78} amp={2} seed={47} fill="#6b4426" cap="#6aaa3a" />
  </>),
  nether: () => (<>
    <Sky id="s6" stops={['#3a0808', '#7a1a10', '#c04010']} />
    <Ridge base={40} amp={12} seed={51} fill="#4a1010" />
    <Ridge base={60} amp={8} seed={53} fill="#6a1a18" />
    <rect x="0" y="74" width={W} height="16" fill="#ff7010" />
    <rect x="0" y="74" width={W} height="2" fill="#ffc040" />
    <Ridge base={78} amp={5} seed={57} fill="#5a1414" cap="#8a2a20" />
  </>),
  stronghold: () => (<>
    <Wall seed={61} pal={['#5a5a5a', '#4e4e4e', '#626262', '#4a5248']} glow="#8a40ff" />
    <rect x="56" y="46" width="48" height="18" fill="#3a5a40" />
    <rect x="60" y="48" width="40" height="12" fill="#0a0418" />
    <g clipPath="url(#portal)">
      <Stars seed={62} n={120} c="#b080ff" />
    </g>
    <defs><clipPath id="portal"><rect x="60" y="48" width="40" height="12" /></clipPath></defs>
  </>),
  mineshaft: () => (<>
    <Wall seed={71} pal={['#5a5a5a', '#555555', '#4a4a4a', '#6a5a4a', '#3a3a3a']} glow="#ffa040" />
    {[20, 70, 120].map(x => (
      <g key={x}>
        <rect x={x} y="20" width="3" height="70" fill="#7a5a30" />
        <rect x={x + 24} y="20" width="3" height="70" fill="#7a5a30" />
        <rect x={x} y="18" width="27" height="3" fill="#8a6a3a" />
      </g>
    ))}
    <rect x="0" y="84" width={W} height="2" fill="#8a8a8a" />
  </>),
  end: () => (<>
    <rect width={W} height={H} fill="#0a0612" />
    <Stars seed={81} n={80} c="#e0c8ff" />
    {[[20, 30], [130, 24], [70, 18]].map(([x, y]) => (
      <g key={x}>
        <rect x={x} y={y} width="6" height={H} fill="#1a1024" />
        <rect x={x + 2} y={y - 2} width="2" height="2" fill="#ff80ff" />
      </g>
    ))}
    <Ridge base={72} amp={4} seed={83} fill="#d8d4a0" cap="#eae6b8" />
  </>),
}

export default memo(function Biome({ scene }) {
  return (
    <svg className="px absolute inset-0 w-full h-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="vig" cx=".5" cy=".5" r=".75">
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".55" />
        </radialGradient>
      </defs>
      {SCENES[scene]()}
      <rect width={W} height={H} fill="url(#vig)" />
    </svg>
  )
})
