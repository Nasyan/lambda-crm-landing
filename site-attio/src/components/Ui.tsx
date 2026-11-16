import type { ReactNode } from 'react'
import { useInViewRepeat } from '../lib/motion'

/**
 * Вход контента: blur 7px и 14px вверх — и так каждый раз, когда блок
 * возвращается в кадр. Страница остаётся живой на обратном скролле.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  amount = 0.25,
}: {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const [ref, inView] = useInViewRepeat<HTMLDivElement>(amount)
  return (
    <div
      ref={ref}
      className={`rise${inView ? ' is-in' : ''}${className ? ' ' + className : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

/** Двухцветный заголовок: утверждение тёмным, пояснение серым. */
export function Split({ lead, rest }: { lead: string; rest?: ReactNode }) {
  return (
    <>
      {lead} {rest && <span className="g">{rest}</span>}
    </>
  )
}

export const Wordmark = ({ light = false }: { light?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 15 L8.5 3 L10.5 3 L16 15 L13.8 15 L9.5 5.6 L5.2 15 Z" fill={light ? '#FAFAFB' : '#1C1D1F'} />
  </svg>
)

const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 } as const

export function CellIcon({ name }: { name: string }) {
  const common = { width: 20, height: 20, viewBox: '0 0 20 20', 'aria-hidden': true } as const
  switch (name) {
    case 'table':
      return (
        <svg {...common} {...s}>
          <rect x="2" y="3" width="16" height="14" rx="2" />
          <line x1="2" y1="8" x2="18" y2="8" />
          <line x1="8" y1="8" x2="8" y2="17" />
        </svg>
      )
    case 'link':
      return (
        <svg {...common} {...s}>
          <circle cx="7" cy="10" r="4" />
          <circle cx="13" cy="10" r="4" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common} {...s} strokeLinejoin="round">
          <path d="M11 2 L4 11 L10 11 L9 18 L16 9 L10 9 Z" />
        </svg>
      )
    case 'ask':
      return (
        <svg {...common} {...s} strokeLinecap="round">
          <path d="M3 4 H17 V13 H9 L5 16 V13 H3 Z" />
        </svg>
      )
    default:
      return (
        <svg {...common} {...s}>
          <rect x="4" y="9" width="12" height="8" rx="2" />
          <path d="M7 9 V6 a3 3 0 0 1 6 0 V9" />
        </svg>
      )
  }
}

export function IntegrationIcon({ name }: { name: string }) {
  const c = { width: 26, height: 26, viewBox: '0 0 24 24', 'aria-hidden': true } as const
  switch (name) {
    case 'telegram':
      return (
        <svg {...c} {...s} strokeLinejoin="round">
          <path d="M3 11 L21 4 L17 20 L11 15 Z" />
          <path d="M11 15 L17 8" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...c} {...s}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7 L12 13 L21 7" />
        </svg>
      )
    case 'site':
      return (
        <svg {...c} {...s}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12 H21 M12 3 C15 6 15 18 12 21 M12 3 C9 6 9 18 12 21" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...c} {...s} strokeLinecap="round">
          <path d="M5 4 H9 L11 9 L8 11 C9.5 14 11 15.5 13 17 L15 14 L20 16 V20 C11 21 3 13 5 4 Z" />
        </svg>
      )
    case 'sheets':
      return (
        <svg {...c} {...s}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10 H21 M9 4 V20 M15 4 V20" />
        </svg>
      )
    case '1c':
      return <span>1С</span>
    case 'docs':
      return (
        <svg {...c} {...s}>
          <path d="M4 7 H20 M4 12 H20 M4 17 H14" />
        </svg>
      )
    default:
      return (
        <svg {...c} {...s} strokeLinecap="round">
          <path d="M10 14 L14 10 M8 16 L6 18 A3 3 0 0 1 2 14 L6 10 M16 8 L18 6 A3 3 0 0 1 22 10 L18 14" />
        </svg>
      )
  }
}
