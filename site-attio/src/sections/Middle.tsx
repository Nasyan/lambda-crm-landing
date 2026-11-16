import { useEffect, useRef, useState } from 'react'
import { CONTEXT_CELLS, SCHEMA_TABS, INTEGRATIONS } from '../data/content'
import { useReveal, useReadProgress, useAutoTabs, reduceMotion } from '../lib/hooks'
import { sphere, schema, type SchemaKind } from '../lib/canvas'
import { Reveal, CellIcon, IntegrationIcon } from '../components/Ui'

/* ——— Внедрение ——— */

const STEPS = [
  ['01', 'Разбираемся', 'неделя 1 · интервью, карта процесса'],
  ['02', 'Проектируем', 'недели 1–2 · схема таблиц и связей'],
  ['03', 'Собираем', 'недели 2–4 · функции, перенос данных'],
  ['04', 'Развиваем', 'после запуска · новые модули'],
]

export function Implementation() {
  const [ref, shown] = useReveal<HTMLDivElement>(0.25)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!shown || reduceMotion()) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2200)
    return () => window.clearInterval(id)
  }, [shown])

  const grown = (i: number) => step >= i

  return (
    <section className="impl section" id="implementation">
      <div className="frame">
        <Reveal className="head head--center">
          <span className="pill">Внедрение</span>
          <h2 className="h2" style={{ maxWidth: 926 }}>
            Запуск от трёх недель.{' '}
            <span className="g">
              Никакого ТЗ с вашей стороны: мы описываем процесс, вы подтверждаете. Новые функции — после
              запуска, без переделки того, что работает.
            </span>{' '}
            <span className="flag">[подтвердить срок]</span>
          </h2>
          <a className="btn btn--primary" href="#request">
            Разобрать мой процесс
          </a>
        </Reveal>

        <div className="win ui impl__card" ref={ref}>
          <div className="impl__steps">
            <div className="dim" style={{ fontSize: 12, marginBottom: 14 }}>
              Шаги
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STEPS.map(([n, title, meta], i) => (
                <div className={`impl__step${i === step ? ' is-on' : ''}`} key={n}>
                  <span className="mono dim">{n}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    <div className="dim" style={{ fontSize: 12 }}>
                      {meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="impl__scheme dots">
            <svg viewBox="0 0 600 300" width="100%" style={{ maxWidth: 600 }} fill="none">
              <line x1="120" y1="80" x2="300" y2="60" stroke="#1C1D1F" strokeWidth="1.5" opacity={grown(1) ? 1 : 0.15} />
              <line x1="300" y1="60" x2="470" y2="90" stroke="#1C1D1F" strokeWidth="1.5" opacity={grown(1) ? 1 : 0.15} />
              <line x1="300" y1="60" x2="300" y2="200" stroke="#1C1D1F" strokeWidth="1.5" opacity={grown(2) ? 1 : 0.15} />
              <line x1="470" y1="90" x2="480" y2="220" stroke="#CAD0D9" strokeWidth="1.5" strokeDasharray="4 4" opacity={grown(3) ? 1 : 0.4} />
              <line x1="120" y1="80" x2="130" y2="220" stroke="#CAD0D9" strokeWidth="1.5" strokeDasharray="4 4" opacity={grown(3) ? 1 : 0.4} />
              {[
                ['Клиенты', 60, 62, true],
                ['Заказы', 240, 42, true],
                ['Изделия', 410, 72, true],
                ['Задачи', 240, 182, grown(2)],
                ['Остатки', 420, 202, grown(3)],
                ['Мастера', 70, 202, grown(3)],
              ].map(([label, x, y, on]) => (
                <g key={label as string}>
                  <rect
                    x={x as number}
                    y={y as number}
                    width="120"
                    height="36"
                    rx="8"
                    fill={on ? '#fff' : '#FAFAFB'}
                    stroke={on ? '#1C1D1F' : '#CAD0D9'}
                    strokeDasharray={on ? undefined : '4 4'}
                  />
                  <text
                    x={(x as number) + 60}
                    y={(y as number) + 22}
                    textAnchor="middle"
                    fontFamily="Inter"
                    fontSize="13"
                    fontWeight="500"
                    fill={on ? '#1C1D1F' : '#A4ADBA'}
                  >
                    {label}
                  </text>
                </g>
              ))}
              <text x="300" y="272" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="12" fill="#6F7988">
                шаг {STEPS[step][0]} · {grown(3) ? '6 таблиц · 5 связей' : '4 таблицы · 3 связи'}
              </text>
            </svg>
          </div>

          <div className="impl__who">
            <div className="dim" style={{ fontSize: 12 }}>
              За три недели
            </div>
            <div>
              <div className="impl__who-label">ВЫ</div>
              <div style={{ marginTop: 4 }}>
                Две встречи по часу, одно согласование, час на обучение команды. Выгрузки из таблиц.
              </div>
            </div>
            <div>
              <div className="impl__who-label">МЫ</div>
              <div style={{ marginTop: 4 }}>
                Карта процесса, схема таблиц и связей, рабочая система с вашими данными, обучение.
              </div>
            </div>
            <div className="dim" style={{ fontSize: 12, borderTop: '1px solid var(--hair)', paddingTop: 12 }}>
              от 3 недель для одного основного процесса · точный срок — после первой встречи
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ——— Тёмная глава ——— */

function Sphere() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return sphere(el, reduceMotion())
  }, [])
  return <canvas className="planet__canvas" ref={ref} aria-hidden="true" />
}

function SchemaCanvas({ kind }: { kind: SchemaKind }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const kindRef = useRef(kind)
  kindRef.current = kind
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return schema(el, () => kindRef.current, reduceMotion())
  }, [])
  return <canvas className="schema__canvas" ref={ref} aria-hidden="true" />
}

export function DarkChapter() {
  const tabs = useAutoTabs(SCHEMA_TABS.length, 6000)

  return (
    <section className="dark dark-chapter section" data-nav-dark>
      <div className="frame">
        <div className="planet stripes-dark">
          <div className="planet__title">
            <Reveal>
              <div style={{ fontSize: 16, color: 'var(--on-dark-2)' }}>У Lambda CRM в основе —</div>
              <div className="h-big" style={{ marginTop: 8 }}>
                Связная структура
              </div>
            </Reveal>
          </div>
          <div className="planet__body" />
          <Sphere />
        </div>

        <div className="cells">
          {CONTEXT_CELLS.map((c) => (
            <div className="cells__item" key={c.title}>
              <span style={{ color: 'var(--on-dark-2)' }}>
                <CellIcon name={c.icon} />
              </span>
              <div>
                <h4>{c.title}</h4>
                <p>{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="schema" ref={tabs.ref}>
          <div className="schema__left">
            <span className="pill">Связи</span>
            <h2 className="h2" style={{ maxWidth: 520 }}>
              Одна структура. <span className="g">Не пять сервисов.</span>
            </h2>
            <a className="btn btn--outline btn--sm" href="#core">
              Посмотреть схему →
            </a>
            <div className="schema__tabs">
              {SCHEMA_TABS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className={`schema__tab${i === tabs.i ? ' is-on' : ''}`}
                  onClick={() => tabs.pick(i)}
                >
                  <span className="schema__tab-title">{t.title}</span>
                  <div className="schema__tab-text">{t.text}</div>
                  {i === tabs.i && (
                    <div className="schema__bar">
                      <span style={tabs.running ? undefined : { width: '100%', animation: 'none' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="schema__right">
            <SchemaCanvas kind={SCHEMA_TABS[tabs.i].id} />
          </div>
        </div>

        <div className="integr stripes-dark">
          <Reveal className="integr__head">
            <span className="pill">Интеграции</span>
            <h3 className="h2">Подключаем то, чем вы уже пользуетесь.</h3>
            <p className="lead" style={{ maxWidth: 520 }}>
              Telegram, почта, сайт, телефония, Google Таблицы, 1С — и то, откуда вы переезжаете.{' '}
              <span className="flag">[подтвердить список]</span>
            </p>
            <a className="btn btn--outline btn--sm" href="#request">
              Обсудить интеграции →
            </a>
          </Reveal>
          <div className="integr__rows">
            <div className="marquee-wrap">
              <div className="marquee integr__row">
                {[...INTEGRATIONS, ...INTEGRATIONS].map((n, i) => (
                  <div className="integr__tile" key={`a-${n}-${i}`}>
                    <IntegrationIcon name={n} />
                  </div>
                ))}
              </div>
            </div>
            <div className="marquee-wrap">
              <div className="marquee marquee--r integr__row">
                {[...INTEGRATIONS].reverse().concat([...INTEGRATIONS].reverse()).map((n, i) => (
                  <div className="integr__tile" key={`b-${n}-${i}`}>
                    <IntegrationIcon name={n} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="export">
          <Reveal className="export__card">
            <h2 className="h2">
              Данные ваши.{' '}
              <span className="g">
                Экспорт всех таблиц в открытом формате — без условий и «периода удержания».
              </span>{' '}
              <span className="flag">[подтвердить формат]</span>
            </h2>
            <a className="btn btn--outline btn--sm" href="#faq">
              Как устроен экспорт →
            </a>
          </Reveal>
          <div className="export__art dots-dark">
            <svg viewBox="0 0 360 300" width="100%" style={{ maxWidth: 360 }} fill="none" stroke="#505967" strokeWidth="1">
              <path d="M80 250 L170 60 L200 60 L290 250 L262 250 L185 92 L108 250 Z" />
              <path d="M80 250 L100 262 L190 72 L170 60" strokeDasharray="3 4" />
              <path d="M290 250 L310 262 L220 72 L200 60" strokeDasharray="3 4" />
              <path d="M108 250 L128 262 L205 104" strokeDasharray="3 4" />
              {Array.from({ length: 10 }, (_, i) => (
                <line key={i} x1={112 + i * 6} y1={240 - i * 14} x2={128 + i * 6} y2={240 - i * 14} strokeWidth="0.6" opacity="0.7" />
              ))}
              {[
                [80, 250],
                [170, 60],
                [200, 60],
                [290, 250],
                [185, 92],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#6F7988" stroke="none" />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ——— Цитата: слова темнеют по мере скролла ——— */

const QUOTE =
  '«Раньше я отвечала мастерам в трёх чатах, кому что срочно. Теперь они видят это сами в таблице, а я вижу остатки. На заказ уходит на [N] минут меньше — я засекала.»'

export function Quote() {
  const [ref, p] = useReadProgress<HTMLParagraphElement>()
  const words = QUOTE.split(' ')
  const lit = Math.round(words.length * Math.min(1, p * 1.15))

  return (
    <section className="quote dots section">
      <div className="frame quote__in">
        <p ref={ref}>
          {words.map((w, i) => (
            <span key={i} style={{ color: i < lit ? 'var(--fg)' : 'var(--fg-4)' }}>
              {w}{' '}
            </span>
          ))}
        </p>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)' }}>[Имя Фамилия]</div>
          <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>
            [должность] · OKPODOLINS <span className="flag">[заменить]</span>
          </div>
        </div>
      </div>
    </section>
  )
}
