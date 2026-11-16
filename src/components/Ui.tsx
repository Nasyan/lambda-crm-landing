import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Mark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 15 L8.5 3 L10.5 3 L16 15 L13.8 15 L9.5 5.6 L5.2 15 Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Icons and wordmark carried over from the Attio version.
export function Icon({
  name = 'table',
  size = 18,
}: {
  name?: string
  size?: number
}) {
  const paths: Record<string, ReactNode> = {
    table: (
      <>
        <rect x="2" y="3" width="16" height="14" rx="2" />
        <path d="M2 8h16M8 8v9" />
      </>
    ),
    link: (
      <>
        <circle cx="7" cy="10" r="4" />
        <circle cx="13" cy="10" r="4" />
      </>
    ),
    bolt: <path d="M11 2 4 11h6l-1 7 7-9h-6z" />,
    lock: (
      <>
        <rect x="4" y="9" width="12" height="8" rx="2" />
        <path d="M7 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    ask: <path d="M3 4h14v9H9l-4 3v-3H3z" />,
    check: <path d="m4 10 4 4 8-8" />,
    arrow: <path d="M3 10h14m-5-5 5 5-5 5" />,
    chart: <path d="M3 3v14h14M7 13v-3m4 3V6m4 7V8" />,
    plus: <path d="M10 4v12M4 10h12" />,
    close: <path d="m5 5 10 10M5 15 15 5" />,
    menu: <path d="M3 5h14M3 10h14M3 15h14" />,
    play: <path d="m7 4 9 6-9 6z" />,
    replay: (
      <>
        <path d="M4 7a7 7 0 1 1 0 6M4 3v4h4" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.table}
    </svg>
  )
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

export function Reveal({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`reveal ${shown || reduced ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function Chip({
  children,
  active = false,
}: {
  children: ReactNode
  active?: boolean
}) {
  return (
    <span className={`chip ${active ? 'chip-active' : ''}`}>
      {active && <span className="status-dot" />}
      {children}
    </span>
  )
}
