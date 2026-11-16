import { useEffect, useRef, useState } from 'react'
import { reduceMotion } from './hooks'

/**
 * Приёмы движения, снятые с лендинга docent и переведённые в монохром:
 * повторяющийся reveal, счётчики, потоковый текст, наклон под курсором,
 * закреплённый горизонтальный трек, тема шапки и пауза для фоновой декорации.
 */

/** Появление, которое повторяется при каждом возврате блока в кадр. */
export function useInViewRepeat<T extends HTMLElement>(amount = 0.25) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion() || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => setInView(e.isIntersecting)), {
      threshold: amount,
    })
    io.observe(el)
    const safety = window.setTimeout(() => setInView(true), 2000)
    return () => {
      io.disconnect()
      window.clearTimeout(safety)
    }
  }, [amount])

  return [ref, inView] as const
}

/** Число, которое досчитывается при каждом входе в кадр. */
export function useCountUp(value: number, ms = 900) {
  const [ref, inView] = useInViewRepeat<HTMLSpanElement>(0.6)
  const [n, setN] = useState(reduceMotion() ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion()) {
      setN(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, ms])

  return [ref, n] as const
}

/** Текст, приходящий группами по 2–4 слова — как ответ системы. */
export function useStream(text: string, active: boolean, stepMs = 80) {
  const [shown, setShown] = useState(active ? '' : text)

  useEffect(() => {
    if (!active) {
      setShown(text)
      return
    }
    if (reduceMotion()) {
      setShown(text)
      return
    }
    const words = text.split(' ')
    let i = 0
    let timer = 0
    setShown('')
    const tick = () => {
      i = Math.min(i + 2 + Math.floor(Math.random() * 3), words.length)
      setShown(words.slice(0, i).join(' '))
      if (i < words.length) timer = window.setTimeout(tick, stepMs)
    }
    timer = window.setTimeout(tick, 180)
    return () => window.clearTimeout(timer)
  }, [text, active, stepMs])

  return shown
}

/** Слова проявляются по очереди, каретка бежит впереди строки. */
export function useWriteIn(count: number, startMs = 300, perMs = 120) {
  const [head, setHead] = useState(reduceMotion() ? count : 0)

  useEffect(() => {
    if (reduceMotion()) {
      setHead(count)
      return
    }
    const timers = Array.from({ length: count }, (_, i) =>
      window.setTimeout(() => setHead(i + 1), startMs + i * perMs),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [count, startMs, perMs])

  return head
}

/**
 * Карточка живёт под курсором: лёгкий наклон и блик, которые идут за мышью
 * по всей странице. Значения кладём в CSS-переменные — их анимирует композитор.
 */
export function usePointerTilt<T extends HTMLElement>(strength = 1) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (reduceMotion()) return
    if (window.matchMedia('(hover: none)').matches) return
    let raf = 0
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const dx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.72), -1, 1)
      const dy = clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight * 0.78), -1, 1)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${(dx * 3.4 * strength).toFixed(2)}deg`)
        el.style.setProperty('--rx', `${(-dy * 2.8 * strength).toFixed(2)}deg`)
        el.style.setProperty('--tx', `${(dx * 5 * strength).toFixed(1)}px`)
        el.style.setProperty('--ty', `${(dy * 4 * strength).toFixed(1)}px`)
        el.style.setProperty('--mx', `${(clamp((e.clientX - r.left) / r.width, 0, 1) * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(clamp((e.clientY - r.top) / r.height, 0, 1) * 100).toFixed(1)}%`)
        el.style.setProperty('--shine', '1')
      })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}

/**
 * Закреплённая секция, внутри которой ряд карточек едет вбок по мере скролла.
 * Возвращает прогресс 0…1 и сдвиг в пикселях; при reduced motion — обычная
 * горизонтальная прокрутка.
 */
export function useScrollTrack() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const rowRef = useRef<HTMLDivElement | null>(null)
  const [shift, setShift] = useState(0)
  const [p, setP] = useState(0)
  const flat = reduceMotion()

  useEffect(() => {
    if (flat) return
    const measure = () => {
      const row = rowRef.current
      if (!row) return
      setShift(Math.max(0, row.scrollWidth - window.innerWidth + 96))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [flat])

  useEffect(() => {
    if (flat) return
    let raf = 0
    const read = () => {
      raf = 0
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const next = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
      setP((prev) => (Math.abs(prev - next) > 0.002 ? next : prev))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [flat])

  // держим последнюю карточку в кадре перед тем, как секция отпустит скролл
  const hold = 0.78
  const eased = Math.min(1, p / hold)

  return { wrapRef, rowRef, shift, progress: eased, flat }
}

/** Шапка знает, над светлой она секцией или над тёмной. */
export function useNavTheme() {
  const [state, setState] = useState({ scrolled: false, dark: false })

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const probe = 26
      let dark = false
      document.querySelectorAll('[data-nav-dark]').forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect()
        if (r.top <= probe && r.bottom >= probe) dark = true
      })
      const scrolled = window.scrollY > 80
      setState((s) => (s.dark === dark && s.scrolled === scrolled ? s : { scrolled, dark }))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // высота секций уточняется после монтирования — перечитываем ещё раз
    const settle = window.setTimeout(read, 400)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(settle)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return state
}

/**
 * Декорация, которой никто не видит, не должна считаться: фоновые слои за
 * экраном ставятся на паузу и снова запускаются за полтора экрана до появления.
 */
const DECOR = '.drift, .spin-slow, .bloom, .sheen-x, .marquee'

export function useIdleDecor() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) (e.target as HTMLElement).removeAttribute('data-paused')
          else (e.target as HTMLElement).setAttribute('data-paused', '')
        }
      },
      { rootMargin: '1400px 0px' },
    )
    const seen = new WeakSet<Element>()
    const scan = () => {
      document.querySelectorAll(DECOR).forEach((el) => {
        if (seen.has(el)) return
        seen.add(el)
        io.observe(el)
      })
    }
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

/** Чипы, дышащие вокруг заголовка и слегка тянущиеся к курсору. */
export function useOrbit(count: number, params: { amp: number; ph: number; par: number }[]) {
  const wrap = useRef<HTMLDivElement | null>(null)
  const items = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (reduceMotion()) return
    let raf = 0
    let mx = 0
    let my = 0
    const onMove = (e: MouseEvent) => {
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      mx = (e.clientX - (r.left + r.width / 2)) / r.width
      my = (e.clientY - (r.top + r.height / 2)) / Math.max(1, r.height)
    }
    const loop = (time: number) => {
      const t = time / 1000
      params.forEach((it, i) => {
        const el = items.current[i]
        if (!el) return
        const wx = Math.sin(t * 0.6 + it.ph) * it.amp + mx * it.par
        const wy = Math.cos(t * 0.5 + it.ph) * it.amp + my * it.par
        el.style.transform = `translate(-50%, -50%) translate3d(${wx.toFixed(1)}px, ${wy.toFixed(1)}px, 0)`
      })
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [count, params])

  const setItem = (i: number) => (el: HTMLElement | null) => {
    items.current[i] = el
  }

  return { wrap, setItem }
}
