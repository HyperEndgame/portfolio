// Six UI glyphs (replaces lucide-react). 24x24 stroke icons.
const P = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M4 12l5 5L20 6',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  volume: 'M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12',
  mute: 'M4 9h4l5-4v14l-5-4H4zM16 9l6 6M22 9l-6 6',
}

export default function Ico({ name, size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
      strokeLinecap="square" className={className} aria-hidden="true">
      <path d={P[name]} />
    </svg>
  )
}
