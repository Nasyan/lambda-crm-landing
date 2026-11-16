/**
 * Два холста тёмной главы: сфера-Облако (горизонт «планеты») и схема таблиц.
 * Обе рисуются в монохроме: свет вместо цвета.
 */

type Stop = () => void

const dpr = () => Math.min(2, window.devicePixelRatio || 1)

function fit(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const ratio = dpr()
  canvas.width = Math.round(rect.width * ratio)
  canvas.height = Math.round(rect.height * ratio)
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  return { ctx, w: rect.width, h: rect.height }
}

/** Точки над горизонтом сферы: медленно вращаются и дышат. */
export function sphere(canvas: HTMLCanvasElement, still: boolean): Stop {
  let raf = 0
  let stopped = false
  const count = 2200
  const pts = Array.from({ length: count }, () => {
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    return { theta, phi, seed: Math.random() }
  })

  let { ctx, w, h } = fit(canvas)
  const onResize = () => ({ ctx, w, h } = fit(canvas))
  window.addEventListener('resize', onResize)

  const draw = (t: number) => {
    if (stopped) return
    ctx.clearRect(0, 0, w, h)
    const cx = w / 2
    const cy = h * 1.28
    const radius = Math.max(w * 0.62, 620)
    const spin = still ? 0 : t * 0.00006
    const breathe = still ? 1 : 1 + Math.sin(t * 0.0006) * 0.012

    for (const p of pts) {
      const theta = p.theta + spin
      const x = Math.sin(p.phi) * Math.cos(theta)
      const y = Math.cos(p.phi)
      const z = Math.sin(p.phi) * Math.sin(theta)
      if (z < -0.1) continue

      const px = cx + x * radius * breathe
      const py = cy - Math.abs(y) * radius * breathe * 0.98
      if (py > h || px < -20 || px > w + 20) continue

      // ярче у самого горизонта — там, где «ободок» света
      const rim = 1 - Math.min(1, Math.abs(y) * 1.9)
      const depth = (z + 1) / 2
      const alpha = Math.max(0, 0.06 + rim * 0.5 * depth + p.seed * 0.06)
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
      ctx.fillRect(px, py, 1.2, 1.2)
    }

    if (!still) raf = requestAnimationFrame(draw)
  }

  raf = requestAnimationFrame(draw)
  return () => {
    stopped = true
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
  }
}

export type SchemaKind = 'links' | 'automations' | 'alerts'

const NODES: Record<SchemaKind, { label: string; x: number; y: number }[]> = {
  links: [
    { label: 'Заказы', x: 0.5, y: 0.5 },
    { label: 'Клиенты', x: 0.22, y: 0.32 },
    { label: 'Изделия', x: 0.78, y: 0.34 },
    { label: 'Задачи', x: 0.28, y: 0.72 },
    { label: 'Остатки', x: 0.75, y: 0.68 },
    { label: 'Мастера', x: 0.5, y: 0.18 },
  ],
  automations: [
    { label: 'Правило', x: 0.5, y: 0.5 },
    { label: 'Оплачен', x: 0.18, y: 0.5 },
    { label: 'Задача', x: 0.82, y: 0.28 },
    { label: 'Срок', x: 0.84, y: 0.52 },
    { label: 'Клиент', x: 0.8, y: 0.76 },
  ],
  alerts: [
    { label: 'События', x: 0.5, y: 0.5 },
    { label: 'Ильяс', x: 0.8, y: 0.26 },
    { label: 'Марина', x: 0.84, y: 0.54 },
    { label: 'Артём', x: 0.78, y: 0.8 },
    { label: 'Заказы', x: 0.2, y: 0.36 },
    { label: 'Остатки', x: 0.22, y: 0.68 },
  ],
}

/** Схема таблиц: узлы, связи и точки, бегущие по связям. */
export function schema(
  canvas: HTMLCanvasElement,
  getKind: () => SchemaKind,
  still: boolean,
): Stop {
  let raf = 0
  let stopped = false
  let { ctx, w, h } = fit(canvas)
  const onResize = () => ({ ctx, w, h } = fit(canvas))
  window.addEventListener('resize', onResize)

  const draw = (t: number) => {
    if (stopped) return
    const kind = getKind()
    const nodes = NODES[kind]
    ctx.clearRect(0, 0, w, h)

    const pos = nodes.map((n) => ({ ...n, px: n.x * w, py: n.y * h }))
    const hub = pos[0]

    // орбиты-подложка
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'
    ctx.lineWidth = 1
    for (const r of [0.16, 0.3, 0.44]) {
      ctx.beginPath()
      ctx.ellipse(hub.px, hub.py, w * r, h * r * 0.66, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // связи
    for (let i = 1; i < pos.length; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.42)'
      ctx.beginPath()
      ctx.moveTo(hub.px, hub.py)
      ctx.lineTo(pos[i].px, pos[i].py)
      ctx.stroke()
    }

    // бегущие точки
    if (!still) {
      for (let i = 1; i < pos.length; i++) {
        const phase = ((t * 0.00022 + i * 0.17) % 1)
        const dir = kind === 'links' ? phase : 1 - phase
        const x = hub.px + (pos[i].px - hub.px) * dir
        const y = hub.py + (pos[i].py - hub.py) * dir
        ctx.fillStyle = 'rgba(255,255,255,0.95)'
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // узлы
    pos.forEach((n, i) => {
      const main = i === 0
      ctx.fillStyle = '#fafafb'
      ctx.beginPath()
      ctx.arc(n.px, n.py, main ? 6 : 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.font = '12px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = main ? '#fafafb' : 'rgba(255,255,255,0.62)'
      ctx.fillText(n.label, n.px, n.py + (main ? 24 : -14))
    })

    if (!still) raf = requestAnimationFrame(draw)
  }

  raf = requestAnimationFrame(draw)
  return () => {
    stopped = true
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
  }
}
