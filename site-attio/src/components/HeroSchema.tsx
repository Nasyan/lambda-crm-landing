/**
 * Схема модели данных в hero — приём с attio.com/platform/data: карточки
 * объектов с полями, связанные линиями со скруглёнными углами, на точечной
 * сетке. Параметры сняты с оригинала: карточка 260px, рамка #EDEFF3, радиус 12,
 * разделитель #E4E7EC. Здесь это не абстракция, а наша структура.
 *
 * Связи размечены как в ER-диаграмме, а не «для красоты»: у каждой есть имя и
 * кратность. Узел на ребре карточки — точка подключения; засечка рядом читается
 * как «один», лапка из трёх штрихов — как «много». Ни одной связи «на глаз»
 * здесь нет: каждая соответствует реальному отношению в базе.
 */

import type { CSSProperties } from 'react'

type FieldKind = 'text' | 'num' | 'link' | 'date'

type Obj = {
  name: string
  kind: 'стандартная' | 'своя'
  fields: [string, FieldKind][]
  more: number
  x: number
  y: number
}

const OBJECTS: Obj[] = [
  {
    name: 'Клиенты',
    kind: 'стандартная',
    fields: [['Имя', 'text'], ['Телефон', 'num'], ['Источник', 'text']],
    more: 9,
    x: -18,
    y: 24,
  },
  {
    name: 'Остатки',
    kind: 'своя',
    fields: [['Позиция', 'text'], ['Остаток', 'num'], ['Минимум', 'num']],
    more: 6,
    x: 1198,
    y: 24,
  },
  {
    name: 'Изделия',
    kind: 'своя',
    fields: [['Название', 'text'], ['Металл · проба', 'text'], ['Размер', 'num']],
    more: 6,
    x: 28,
    y: 232,
  },
  {
    name: 'Мастера',
    kind: 'своя',
    fields: [['Имя', 'text'], ['Специализация', 'text'], ['Загрузка', 'num']],
    more: 4,
    x: 1152,
    y: 232,
  },
  {
    name: 'Заказы',
    kind: 'стандартная',
    fields: [['№ · дата', 'date'], ['Клиент', 'link'], ['Сумма · оплата', 'num']],
    more: 11,
    x: 250,
    y: 424,
  },
  {
    name: 'Задачи',
    kind: 'стандартная',
    fields: [['Что сделать', 'text'], ['Ответственный', 'link'], ['Срок', 'date']],
    more: 7,
    x: 590,
    y: 424,
  },
  {
    name: 'Оплаты',
    kind: 'своя',
    fields: [['Сумма', 'num'], ['Дата', 'date'], ['Заказ', 'link']],
    more: 5,
    x: 930,
    y: 424,
  },
]

/** Конец связи: точка на ребре карточки, поворот наружу и кратность. */
type End = { x: number; y: number; rot: 0 | 90 | 180 | 270; n: 'one' | 'many' }

type Rel = {
  /** что это за отношение — для читателя схемы и для нас */
  title: string
  d: string
  a: End
  b: End
  label?: { t: string; x: number; y: number }
}

const RELS: Rel[] = [
  {
    // один клиент — много заказов
    title: 'Клиенты 1 → ∞ Заказы',
    d: 'M242 102 H350 A30 30 0 0 1 380 132 V424',
    a: { x: 242, y: 102, rot: 0, n: 'one' },
    b: { x: 380, y: 424, rot: 270, n: 'many' },
    label: { t: 'заказы', x: 380, y: 300 },
  },
  {
    // в заказе несколько изделий
    title: 'Заказы 1 → ∞ Изделия',
    d: 'M158 389 V472 A30 30 0 0 0 188 502 H250',
    a: { x: 158, y: 389, rot: 90, n: 'many' },
    b: { x: 250, y: 502, rot: 180, n: 'one' },
    label: { t: 'состав', x: 158, y: 434 },
  },
  {
    // изделие проходит через нескольких мастеров, мастер ведёт много изделий
    title: 'Изделия ∞ ↔ ∞ Мастера',
    d: 'M288 310 H1152',
    a: { x: 288, y: 310, rot: 0, n: 'many' },
    b: { x: 1152, y: 310, rot: 180, n: 'many' },
    label: { t: 'работы', x: 1004, y: 310 },
  },
  {
    // задача назначена одному исполнителю
    title: 'Мастера 1 → ∞ Задачи',
    d: 'M1152 350 H910 A30 30 0 0 0 880 380 V472 A30 30 0 0 1 850 502',
    a: { x: 1152, y: 350, rot: 180, n: 'one' },
    b: { x: 850, y: 502, rot: 0, n: 'many' },
    label: { t: 'исполнитель', x: 880, y: 410 },
  },
  {
    // материал выдаётся мастеру и списывается с остатков
    title: 'Остатки ∞ ↔ ∞ Мастера',
    d: 'M1198 102 H1140 A22 22 0 0 0 1118 124 V188 A22 22 0 0 0 1140 210 H1260 A22 22 0 0 1 1282 232',
    a: { x: 1198, y: 102, rot: 180, n: 'many' },
    b: { x: 1282, y: 232, rot: 270, n: 'many' },
    label: { t: 'выдачи', x: 1118, y: 156 },
  },
  {
    // по заказу заводится несколько задач
    title: 'Заказы 1 → ∞ Задачи',
    d: 'M510 502 H590',
    a: { x: 510, y: 502, rot: 0, n: 'one' },
    b: { x: 590, y: 502, rot: 180, n: 'many' },
  },
  {
    // заказ может оплачиваться частями
    title: 'Заказы 1 → ∞ Оплаты',
    d: 'M450 581 V588 A18 18 0 0 0 468 606 H982 A18 18 0 0 0 1000 588 V581',
    a: { x: 450, y: 581, rot: 90, n: 'one' },
    b: { x: 1000, y: 581, rot: 90, n: 'many' },
    label: { t: 'оплаты', x: 725, y: 606 },
  },
]

/**
 * Разметка конца связи в локальной системе: начало — точка на ребре карточки,
 * ось x направлена от карточки вдоль линии.
 */
function EndMark({ e }: { e: End }) {
  return (
    <g transform={`translate(${e.x} ${e.y}) rotate(${e.rot})`}>
      {e.n === 'one' ? (
        <path className="hero__link-mark" d="M11 -4.5 V4.5" />
      ) : (
        <path className="hero__link-mark" d="M9 -5 L18 0 M9 0 H18 M9 5 L18 0" />
      )}
      <circle className="hero__link-node" cx="5" cy="0" r="3.2" />
    </g>
  )
}

function Chip({ t, x, y }: { t: string; x: number; y: number }) {
  const w = t.length * 5.5 + 15
  return (
    <g>
      <rect className="hero__link-chip" x={x - w / 2} y={y - 8.5} width={w} height={17} rx="5" />
      <text className="hero__link-label" x={x} y={y + 3.2} textAnchor="middle">
        {t}
      </text>
    </g>
  )
}

function TypeIcon({ kind }: { kind: FieldKind }) {
  const p = { width: 13, height: 13, viewBox: '0 0 14 14', fill: 'none', stroke: '#A4ADBA', strokeWidth: 1.2 } as const
  if (kind === 'num')
    return (
      <svg {...p} strokeLinecap="round">
        <path d="M5 2.5 L3.6 11.5 M9.4 2.5 L8 11.5 M2.4 5.4 H11 M2 8.6 H10.6" />
      </svg>
    )
  if (kind === 'link')
    return (
      <svg {...p} strokeLinecap="round">
        <path d="M6.2 7.8 L9.6 4.4 M4.6 9.4 L3.4 10.6 A2.4 2.4 0 0 1 3.4 7 L5.4 5 M8.6 4.6 L10.6 2.6 A2.4 2.4 0 0 1 12 6.6 L10.4 8.2" />
      </svg>
    )
  if (kind === 'date')
    return (
      <svg {...p}>
        <rect x="2" y="3" width="10" height="9" rx="2" />
        <path d="M2 6 H12 M4.6 1.8 V3.6 M9.4 1.8 V3.6" strokeLinecap="round" />
      </svg>
    )
  return (
    <svg {...p} strokeLinecap="round">
      <path d="M2.6 4 H11.4 M2.6 7 H11.4 M2.6 10 H8" />
    </svg>
  )
}

function ObjIcon() {
  return (
    <span className="objcard__icon" aria-hidden="true">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#6F7988" strokeWidth="1.3">
        <rect x="1.6" y="2.2" width="10.8" height="9.6" rx="2" />
        <path d="M1.6 5.4 H12.4 M5.4 5.4 V11.8" />
      </svg>
    </span>
  )
}

export function HeroSchema({ p }: { p: number }) {
  return (
    <div
      className="hero__schema"
      aria-hidden="true"
      style={{ '--pz': `${(-p * 22).toFixed(1)}px` } as CSSProperties}
    >
      <svg className="hero__schema-links" viewBox="0 0 1440 620" fill="none" preserveAspectRatio="none">
        {RELS.map((r, i) => (
          <path key={r.title} className="hero__link" d={r.d} style={{ animationDelay: `${i * -1.7}s` }} />
        ))}
        {RELS.map((r) => (
          <g key={`m-${r.title}`}>
            <EndMark e={r.a} />
            <EndMark e={r.b} />
          </g>
        ))}
        {RELS.map((r) => (r.label ? <Chip key={`c-${r.title}`} {...r.label} /> : null))}
      </svg>

      {OBJECTS.map((o) => (
        <div className="objcard" key={o.name} style={{ left: o.x, top: o.y }}>
          <div className="objcard__head">
            <ObjIcon />
            <span className="objcard__name">{o.name}</span>
            <span className="objcard__badge">{o.kind}</span>
          </div>
          {o.fields.map(([label, kind]) => (
            <div className="objcard__row" key={label}>
              <TypeIcon kind={kind} />
              {label}
            </div>
          ))}
          <div className="objcard__more">+ {o.more} полей</div>
        </div>
      ))}
    </div>
  )
}
