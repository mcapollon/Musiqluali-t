export function GrainOverlay({
  className,
  opacity = 0.18,
}: {
  className?: string
  opacity?: number
}) {
  return (
    <svg
      className={`pointer-events-none ${className ?? ''}`}
      aria-hidden
      style={{ opacity, mixBlendMode: 'multiply' }}
    >
      <filter id="grain-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0.89  0 0 0 0 0.63  0 0 0 0 0.23  0 0 0 0.4 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  )
}
