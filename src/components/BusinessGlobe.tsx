import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { Icon, Mark, useReducedMotion } from './Ui'

export const NETWORKS = [
  {
    name: 'Магазин',
    labels: ['Заказы', 'Клиенты', 'Мастера', 'Изделия', 'Остатки', 'Задачи'],
    details: [
      [
        'Заказ №1042',
        'Кольцо · золото 585',
        'Анна Полякова',
        'Мастер — Ильяс',
        'Срок — 12 сентября',
      ],
      [
        'Анна Полякова',
        '3 заказа · одна история',
        'Кольцо №1042',
        'Эскиз и размер',
        'Оплата 48 900 ₽',
      ],
      [
        'Мастер Ильяс',
        'Работа и сроки в одном месте',
        'Заказ №1042',
        'Подвеска №1040',
        'Связанные задачи',
      ],
      [
        'Кольцо · золото 585',
        'Свойства именно вашего товара',
        'Размер — 17,5',
        'Связанный заказ',
        'Остаток на складе',
      ],
      [
        'Остатки',
        'Продажа меняет данные на складе',
        'Изделие — кольцо 585',
        'После продажи: 4 → 3',
        'Минимум — 2 шт.',
      ],
      [
        'Изготовить кольцо',
        'Задача знает свой контекст',
        'Заказ №1042',
        'Ответственный — Ильяс',
        'Срок — 12 сентября',
      ],
    ],
  },
  {
    name: 'Кофейня',
    labels: ['Продажи', 'Гости', 'Сотрудники', 'Смены', 'Склад', 'Закупки'],
    details: [
      [
        'Продажи',
        'Чек связан с гостем и складом',
        'Состав заказа',
        'Списание ингредиентов',
        'Себестоимость',
      ],
      [
        'Гость',
        'История без отдельной таблицы',
        'Заказы',
        'Повторные визиты',
        'Предпочтения',
      ],
      ['Сотрудники', 'Каждый знает свою смену', 'График', 'Подмены', 'Ставки'],
      [
        'Утренняя смена',
        'Все договорённости в одном месте',
        'Бариста — Анна',
        'Чек-лист открытия',
        'Отчёт управляющему',
      ],
      [
        'Склад',
        'Остатки связаны с продажами',
        'Приходы',
        'Списания',
        'Минимальный запас',
      ],
      [
        'Закупки',
        'Пополнение по данным склада',
        'Поставщик',
        'Срок поставки',
        'Количество',
      ],
    ],
  },
  {
    name: 'Проекты',
    labels: ['Проекты', 'Клиенты', 'Команда', 'Этапы', 'Оплаты', 'Задачи'],
    details: [
      [
        'Проект «Витрина»',
        'От договора до последнего этапа',
        'Клиент',
        'Бюджет и оплаты',
        'Этапы и задачи',
      ],
      [
        'Компания клиента',
        'Все проекты и договорённости',
        'Контакты',
        'Документы',
        'История проектов',
      ],
      [
        'Команда',
        'Кто за что отвечает',
        'Участники проекта',
        'Загрузка',
        'Сроки',
      ],
      [
        'Этап «Проектирование»',
        'Готовность видна всем участникам',
        'Связанный проект',
        'Срок',
        'Оплата этапа',
      ],
      ['Оплаты', 'Суммы связаны с работой', 'Счёт', 'Этап', 'Дата оплаты'],
      [
        'Подготовить макет',
        'Следующий шаг с контекстом',
        'Ответственный',
        'Этап проекта',
        'Срок выполнения',
      ],
    ],
  },
]

type Point = { x: number; y: number; z: number }
const sphere = (lat: number, lon: number): Point => ({
  x: Math.cos(lat) * Math.sin(lon),
  y: Math.sin(lat),
  z: Math.cos(lat) * Math.cos(lon),
})
const dots = Array.from({ length: 720 }, (_, i) => {
  const y = 1 - (i / 719) * 2
  const r = Math.sqrt(1 - y * y)
  const angle = i * Math.PI * (3 - Math.sqrt(5))
  return { x: Math.cos(angle) * r, y, z: Math.sin(angle) * r }
})
const locations = [
  [-0.2, -0.65],
  [-0.6, 0.8],
  [0.48, 0.45],
  [0.23, 1.65],
  [0.65, -1.25],
  [-0.45, -2.3],
].map(([lat, lon]) => sphere(lat, lon))

export function BusinessGlobe({
  network,
  active,
  onSelect,
}: {
  network: number
  active: number
  onSelect: (i: number) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const labels = useRef<(HTMLButtonElement | null)[]>([])
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [dragging, setDragging] = useState(false)
  const motion = useRef({
    x: -0.14,
    y: 0,
    tx: -0.14,
    ty: 0,
    vx: 0,
    vy: 0,
    pointer: -1,
    px: 0,
    py: 0,
    moved: false,
    pauseUntil: 0,
  })
  const currentActive = useRef(active)
  currentActive.current = active
  const paint = useRef<() => void>(() => {})

  useEffect(() => {
    const host = root.current,
      surface = canvas.current
    if (!host || !surface) return
    const ctx = surface.getContext('2d')
    if (!ctx) return
    let width = 500,
      height = 500,
      inView = false,
      frame = 0,
      previous = 0
    const rotate = (p: Point) => {
      const m = motion.current,
        cy = Math.cos(m.y),
        sy = Math.sin(m.y),
        cx = Math.cos(m.x),
        sx = Math.sin(m.x)
      const x = p.x * cy + p.z * sy,
        z = p.z * cy - p.x * sy
      return { x, y: p.y * cx - z * sx, z: p.y * sx + z * cx }
    }
    const draw = () => {
      const r = Math.min(width, height) * 0.365,
        center = { x: width / 2, y: height / 2 }
      ctx.clearRect(0, 0, width, height)
      const project = (p: Point) => ({
        x: center.x + p.x * r,
        y: center.y + p.y * r,
        z: p.z,
      })
      // Great circles and depth-shaded points describe the same rotatable data space.
      for (let ring = 0; ring < 3; ring++) {
        let last: Point | null = null
        for (let i = 0; i <= 144; i++) {
          const a = (i / 144) * Math.PI * 2
          const p =
            ring === 0
              ? { x: Math.cos(a), y: 0, z: Math.sin(a) }
              : ring === 1
                ? {
                    x: Math.cos(a) * 0.7,
                    y: Math.sin(a),
                    z: Math.cos(a) * 0.714,
                  }
                : {
                    x: Math.cos(a) * 0.45,
                    y: Math.cos(a) * 0.893,
                    z: Math.sin(a),
                  }
          const v = project(rotate(p))
          if (last) {
            ctx.beginPath()
            ctx.moveTo(last.x, last.y)
            ctx.lineTo(v.x, v.y)
            ctx.strokeStyle = `rgba(83,83,83,${v.z > 0 ? 0.28 : 0.06})`
            ctx.lineWidth = 0.75
            ctx.stroke()
          }
          last = v
        }
      }
      dots.forEach((p) => {
        const v = project(rotate(p))
        if (v.z < -0.1) return
        const depth = Math.max(0, v.z)
        ctx.beginPath()
        ctx.arc(v.x, v.y, 0.55 + depth * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(51,51,51,${0.08 + depth * 0.36})`
        ctx.fill()
      })
      const projected = locations.map((p) => project(rotate(p)))
      const origin = projected[currentActive.current]
      projected.forEach((p, i) => {
        if (i === currentActive.current || origin.z < 0.05 || p.z < 0.05) return
        ctx.beginPath()
        ctx.moveTo(origin.x, origin.y)
        ctx.quadraticCurveTo(center.x, center.y, p.x, p.y)
        ctx.strokeStyle = 'rgba(49,49,49,.28)'
        ctx.lineWidth = 0.8
        ctx.setLineDash([2, 4])
        ctx.stroke()
        ctx.setLineDash([])
      })
      projected.forEach((p, i) => {
        const el = labels.current[i]
        if (!el) return
        const depth = Math.max(0, p.z)
        el.style.transform = `translate(-50%,-50%) scale(${0.84 + depth * 0.16})`
        el.style.left = `${p.x}px`
        el.style.top = `${p.y}px`
        el.style.opacity = p.z > -0.12 ? String(0.55 + depth * 0.45) : '0'
        el.style.visibility = p.z > -0.12 ? 'visible' : 'hidden'
        el.style.zIndex = String(5 + Math.round(depth * 20))
      })
    }
    paint.current = draw
    const resize = () => {
      const bounds = host.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      surface.width = width * dpr
      surface.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }
    const tick = (now: number) => {
      frame = 0
      if (!inView || document.hidden) return
      const dt = Math.min((now - previous) / 1000 || 1 / 60, 0.032)
      previous = now
      const m = motion.current
      if (!reduced) {
        if (!paused && m.pointer === -1 && now > m.pauseUntil) m.ty += dt * 0.07
        // Spring follows the drag, with damping rather than a hard stop.
        m.vx += ((m.tx - m.x) * 170 - m.vx * 25) * dt
        m.vy += ((m.ty - m.y) * 170 - m.vy * 25) * dt
        m.x += m.vx * dt
        m.y += m.vy * dt
      } else {
        m.x = m.tx
        m.y = m.ty
      }
      draw()
      if (!reduced) frame = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      if (inView && !document.hidden) {
        previous = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        wake()
      },
      { threshold: 0.05 },
    )
    const ro = new ResizeObserver(resize)
    io.observe(host)
    ro.observe(host)
    resize()
    document.addEventListener('visibilitychange', wake)
    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', wake)
    }
  }, [paused, reduced])

  useEffect(() => {
    const m = motion.current,
      point = locations[active]
    const yaw = -Math.atan2(point.x, point.z) + 0.4
    // Keep the selected record on the near side, using the shortest rotation.
    m.ty += Math.atan2(Math.sin(yaw - m.ty), Math.cos(yaw - m.ty))
    m.tx = Math.asin(point.y) + 0.18
    m.pauseUntil = performance.now() + 5000
    if (reduced) {
      m.x = m.tx
      m.y = m.ty
    }
    paint.current()
  }, [network, active, reduced])
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const m = motion.current
    if (m.pointer !== e.pointerId) return
    m.pointer = -1
    m.pauseUntil = performance.now() + 2500
    setDragging(false)
    // A small release snap makes stopping intentional and leaves labels legible.
    m.tx = Math.round(m.tx / 0.08) * 0.08
    m.ty = Math.round(m.ty / 0.1) * 0.1
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId)
    if (reduced) {
      m.x = m.tx
      m.y = m.ty
      paint.current()
    }
  }
  const reset = () => {
    const m = motion.current
    m.tx = -0.14
    m.ty = 0
    m.pauseUntil = performance.now() + 2500
    if (reduced) {
      m.x = m.tx
      m.y = m.ty
      paint.current()
    }
  }
  return (
    <div className="business-globe">
      <div
        className={`globe-surface ${dragging ? 'is-dragging' : ''}`}
        ref={root}
        role="group"
        tabIndex={0}
        aria-label="Вращаемая схема бизнеса. Перетаскивайте или используйте стрелки. Home — исходное положение."
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse' && e.button !== 0) return
          const m = motion.current
          m.pointer = e.pointerId
          m.px = e.clientX
          m.py = e.clientY
          m.moved = false
          setDragging(true)
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          const m = motion.current
          if (m.pointer !== e.pointerId) return
          const dx = e.clientX - m.px,
            dy = e.clientY - m.py
          m.ty += dx * 0.0065
          m.tx = Math.max(-1.15, Math.min(1.15, m.tx - dy * 0.005))
          m.px = e.clientX
          m.py = e.clientY
          m.moved = true
          if (reduced) {
            m.x = m.tx
            m.y = m.ty
            paint.current()
          }
        }}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onDoubleClick={reset}
        onKeyDown={(e) => {
          const m = motion.current
          if (
            [
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              'Home',
            ].includes(e.key)
          ) {
            e.preventDefault()
            m.pauseUntil = performance.now() + 4000
          }
          if (e.key === 'Home') reset()
          if (e.key === 'ArrowLeft') m.ty -= 0.25
          if (e.key === 'ArrowRight') m.ty += 0.25
          if (e.key === 'ArrowUp') m.tx = Math.max(-1.15, m.tx - 0.15)
          if (e.key === 'ArrowDown') m.tx = Math.min(1.15, m.tx + 0.15)
          if (reduced) {
            m.x = m.tx
            m.y = m.ty
            paint.current()
          }
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
        <div className="globe-center" aria-hidden="true">
          <Mark />
        </div>
        {NETWORKS[network].labels.map((label, i) => (
          <button
            key={i}
            ref={(el) => {
              labels.current[i] = el
            }}
            className={`globe-label ${active === i ? 'active' : ''}`}
            aria-pressed={active === i}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              onSelect(i)
              motion.current.pauseUntil = performance.now() + 5000
            }}
          >
            <Icon
              name={
                i === 0
                  ? 'table'
                  : i === 4
                    ? 'chart'
                    : i === 5
                      ? 'check'
                      : 'link'
              }
              size={15}
            />
            {label}
          </button>
        ))}
      </div>
      <div className="globe-controls">
        <span>
          <Icon name="link" size={13} /> Вращайте. Выбирайте. Исследуйте связи.
        </span>
        <button
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
          aria-label={paused ? 'Продолжить вращение' : 'Приостановить вращение'}
        >
          {paused ? 'Вращать' : 'Пауза'}
        </button>
        <button onClick={reset} aria-label="Сбросить вращение">
          <Icon name="replay" size={14} />
        </button>
      </div>
    </div>
  )
}
