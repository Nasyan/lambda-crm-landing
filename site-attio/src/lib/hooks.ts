import { useEffect, useRef, useState } from 'react'

export const reduceMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Появление блока: blur 2.5px → 0, 4px вверх. Один раз. */
export function useReveal<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion()) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    // страховка: если наблюдатель почему-то не сработал, контент всё равно виден
    const safety = window.setTimeout(() => setShown(true), 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(safety)
    }
  }, [threshold])

  return [ref, shown] as const
}

/** Прогресс скролла в hero: 0 на самом верху, 1 после `distance` пикселей. */
export function useScrollProgress(distance = 350) {
  const [p, setP] = useState(0)

  useEffect(() => {
    if (reduceMotion()) return
    let frame = 0
    const read = () => {
      frame = 0
      const next = Math.min(1, Math.max(0, window.scrollY / distance))
      setP((prev) => (Math.abs(prev - next) > 0.002 ? next : prev))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [distance])

  return p
}

/** Scroll-spy для навигации по «Ядру»: какая группа сейчас на экране. */
export function useStepNav(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      const line = window.innerHeight * 0.42
      let next = 0
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) next = i
      })
      setActive((prev) => (prev === next ? prev : next))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [count])

  const setRef = (i: number) => (el: HTMLElement | null) => {
    refs.current[i] = el
  }

  return { active, setRef }
}

/**
 * Сценарий внутри демо: шаги 0..steps-1 проигрываются по очереди,
 * когда карточка входит в вид. Один прогон, при reduced motion — сразу финал.
 */
export function useScenario<T extends HTMLElement>(steps: number, stepMs = 900) {
  const [ref, shown] = useReveal<T>(0.4)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!shown) return
    if (reduceMotion()) {
      setStep(steps - 1)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setStep(i)
      if (i >= steps - 1) window.clearInterval(id)
    }, stepMs)
    return () => window.clearInterval(id)
  }, [shown, steps, stepMs])

  return [ref, step] as const
}

/** Вкладки с прогресс-полосой: сами переключаются каждые `ms`. */
export function useAutoTabs(count: number, ms = 6000) {
  const [ref, shown] = useReveal<HTMLDivElement>(0.3)
  const [i, setI] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (!shown || manual || reduceMotion()) return
    const id = window.setInterval(() => setI((v) => (v + 1) % count), ms)
    return () => window.clearInterval(id)
  }, [shown, manual, count, ms])

  const pick = (n: number) => {
    setManual(true)
    setI(n)
  }

  return { ref, i, pick, running: shown && !manual && !reduceMotion() }
}

/** Прогресс прочтения элемента по мере скролла: 0 — снизу экрана, 1 — сверху. */
export function useReadProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion()) {
      setP(1)
      return
    }
    let frame = 0
    const read = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const start = window.innerHeight * 0.85
      const end = window.innerHeight * 0.25
      const next = Math.min(1, Math.max(0, (start - r.top) / (start - end)))
      setP((prev) => (Math.abs(prev - next) > 0.01 ? next : prev))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return [ref, p] as const
}
