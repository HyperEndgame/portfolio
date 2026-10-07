// Renders a pixel map (array of strings) as crisp SVG. '.' = transparent.
export default function Pixel({ icon, size = 32, className = '' }) {
  const { map, pal } = icon
  const h = map.length, w = map[0].length
  const rects = []
  map.forEach((row, y) => [...row].forEach((ch, x) => {
    if (pal[ch]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={pal[ch]} />)
  }))
  return (
    <svg className={`px ${className}`} viewBox={`0 0 ${w} ${h}`} width={size} height={size * h / w} aria-hidden="true">
      {rects}
    </svg>
  )
}
