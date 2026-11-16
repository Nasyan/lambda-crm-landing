import { useEffect, useRef, useState, type FormEvent } from 'react'
import { NAV, LEFT_FOR_US } from '../data/content'
import { ROTATING_PROMPTS, resolveStructure, type StructureSpec } from '../data/structures'
import { useScrollProgress, reduceMotion } from '../lib/hooks'
import { usePointerTilt, useWriteIn, useNavTheme } from '../lib/motion'
import { Wordmark } from '../components/Ui'
import { HeroSchema } from '../components/HeroSchema'

export function Header() {
  const { scrolled, dark } = useNavTheme()
  return (
    <header className={`hdr${dark ? ' hdr--dark' : ''}${scrolled ? '' : ' hdr--top'}`}>
      <div className="frame hdr__in">
        <div className="hdr__left">
          <a className="brand" href="#top">
            <Wordmark />
            <span>lmbd.crm</span>
          </a>
          <nav className="hdr__nav">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <a className="btn btn--primary" href="#request">
          Разобрать мой процесс
        </a>
      </div>
    </header>
  )
}

/* ——— Сабтайтл, который пишется по словам, каретка бежит впереди ——— */
function WriteIn({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  const head = useWriteIn(words.length, 400, 110)
  return (
    <p className={className}>
      {head === 0 && <span className="caret" aria-hidden="true" />}
      {words.map((w, i) => (
        <span key={i}>
          <span className={`word${i < head ? ' is-in' : ''}`} style={{ transitionDelay: `${i * 8}ms` }}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
          {head === i + 1 && i < words.length - 1 && <span className="caret" aria-hidden="true" />}
        </span>
      ))}
    </p>
  )
}

const ORDERS = [
  ['1042', 'Анна Полякова', 'Кольцо · золото 585', '48 900', 'Ильяс', '12.09'],
  ['1041', 'Дмитрий Лебедев', 'Серьги · серебро', '12 400', 'Марина', '10.09'],
  ['1040', 'Ольга Кузнецова', 'Подвеска · золото', '27 300', 'Ильяс', '09.09'],
  ['1039', 'Сергей Панов', 'Кольцо · платина', '96 000', '—', '15.09'],
  ['1038', 'Мария Орлова', 'Браслет · серебро', '9 800', 'Марина', '05.09'],
  ['1037', 'Игорь Савин', 'Цепочка · золото', '31 500', 'Артём', '04.09'],
  ['1036', 'Елена Жукова', 'Кольцо · золото 585', '44 200', 'Артём', '02.09'],
]
const REST = ['В работе', 'В работе', 'Ожидает оплаты', 'Готов', 'Готов', 'Просрочен']
const restClass = (label: string) =>
  label === 'Просрочен' ? 'st--alert' : label === 'Ожидает оплаты' ? 'st--line' : 'st--fill'

/* ——— Структура, собранная по описанию процесса ——— */
function Built({ spec, query, onReset }: { spec: StructureSpec; query: string; onReset: () => void }) {
  const links = spec.tables.reduce(
    (n, t) => n + t.fields.filter((f) => f.includes('←') || f.includes('→')).length,
    0,
  )
  return (
    <div className="built ui">
      <div className="built__tables">
        {spec.tables.map((t, i) => (
          <div className="built__table" key={t.name} style={{ animationDelay: `${i * 130}ms` }}>
            <div className="built__name">{t.name}</div>
            {t.fields.map((f, j) => (
              <div
                className="built__field"
                key={f}
                style={{ animation: `builtIn 300ms var(--ease-out) ${i * 130 + 200 + j * 70}ms both` }}
              >
                {f}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="built__auto">
        {spec.automation.map((a, i) => (
          <span
            className="st st--solid"
            key={a}
            style={{ animationDelay: `${700 + i * 130}ms` }}
          >
            {a}
          </span>
        ))}
      </div>

      <div className="built__line">
        {spec.known ? (
          <>
            так может выглядеть ваша база · {spec.tables.length} таблицы · {links} связи · 1 автоматизация
          </>
        ) : (
          <>под такой процесс структуру соберём вместе — это и есть наша работа</>
        )}
      </div>
      <div className="built__cta">
        <a className="btn btn--primary" href="#request">
          Обсудить на разборе →
        </a>
        <button className="btn btn--outline" type="button" onClick={onReset}>
          Собрать заново
        </button>
      </div>
      {query && (
        <div className="cap" style={{ textAlign: 'center', marginTop: 12 }}>
          процесс: «{query}»
        </div>
      )}
    </div>
  )
}

export function Hero() {
  const p = useScrollProgress(350)
  const worked = p > 0.55
  const tiltRef = usePointerTilt<HTMLDivElement>()

  const [mode, setMode] = useState<'idle' | 'asking' | 'built'>('idle')
  const [draft, setDraft] = useState('')
  const [spec, setSpec] = useState<StructureSpec | null>(null)
  const [rotor, setRotor] = useState(0)
  const built = mode === 'built'
  const inputRef = useRef<HTMLInputElement | null>(null)

  // ротация подсказки у клавиши
  useEffect(() => {
    if (mode !== 'idle' || reduceMotion()) return
    const id = window.setInterval(() => setRotor((r) => (r + 1) % ROTATING_PROMPTS.length), 3000)
    return () => window.clearInterval(id)
  }, [mode])

  // «/» открывает композер откуда угодно, Esc закрывает
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        setMode('asking')
        window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' })
        window.setTimeout(() => inputRef.current?.focus(), 260)
      }
      if (e.key === 'Escape') {
        setMode('idle')
        setSpec(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const ask = (text: string) => {
    const q = text.trim()
    setDraft(q)
    setSpec(resolveStructure(q))
    setMode('built')
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (draft.trim()) ask(draft)
  }

  return (
    <section className="hero" id="top">
      <div className="hero__sky" style={{ opacity: 0.22 + p * 0.22 }} />
      <div className="hero__dots" />
      <HeroSchema p={p} />
      <div className="hero__conic spin-slow" aria-hidden="true" />
      <div className="hero__bloom bloom" style={{ right: '-6%', top: '4%', width: 560, height: 460 }} aria-hidden="true" />
      <div
        className="hero__bloom bloom"
        style={{ left: '-8%', top: '38%', width: 480, height: 420, animationDelay: '-4s' }}
        aria-hidden="true"
      />


      <div className="frame hero__in">
        <div
          className="hero__top"
          style={{
            opacity: 1 - p,
            filter: `blur(${(p * 2.5).toFixed(2)}px)`,
            pointerEvents: p > 0.9 ? 'none' : 'auto',
          }}
        >
          <a className="btn btn--outline btn--sm hero__badge" href="#cases">
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fg)' }} />
            Первое внедрение: OKPODOLINS, магазин украшений <span className="g">›</span>
          </a>
          <h1 className="h1">CRM, собранная под ваш процесс.</h1>
          <WriteIn
            className="lead hero__lead"
            text="Не шаблон и не разработка с нуля. Ядро готово — таблицы, карточки, связи, автоматизации, права, аналитика. Структуру под вас проектирует наша команда."
          />

          {mode !== 'idle' && (
            <form className="hero__composer" onSubmit={submit}>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Например: ${ROTATING_PROMPTS[rotor]}`}
                aria-label="Опишите свой процесс"
              />
              <button className="hero__send" type="submit" aria-label="Собрать структуру">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 13V3.5M4 7l4-3.5L12 7" />
                </svg>
              </button>
            </form>
          )}

          {mode !== 'idle' && (
            <div className="hero__chips">
              {ROTATING_PROMPTS.map((t) => (
                <button key={t} type="button" className="hero__chip" onClick={() => ask(t)}>
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="hero__cta">
            <a className="btn btn--outline" href="#core">
              Посмотреть, как работает
            </a>
            <a className="btn btn--primary" href="#request">
              Разобрать мой процесс
            </a>
          </div>
          <div className="cap hero__note">30 минут · без обязательств · ответим в течение дня</div>
        </div>

        <div className="hero__stage float" style={{ transform: `scale(${1 - p * 0.05})` }}>
          <div className="hero__win tilt" ref={tiltRef}>
            <div className="sheen" />
            <div className="win__bar">
              <i />
              <i />
              <i />
            </div>

            {mode === 'built' && spec ? (
              <div className="hero__screen hero__screen--built">
                <Built spec={spec} query={draft} onReset={() => { setMode('idle'); setSpec(null); setDraft('') }} />
              </div>
            ) : (
              <div className="hero__screen ui">
                <div className="hero__side">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', marginBottom: 8 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: '#1C1D1F',
                        color: '#fff',
                        fontSize: 11,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      O
                    </span>
                    <b>OKPODOLINS</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', border: '1px solid var(--hair)', borderRadius: 8, background: '#fff', marginBottom: 8 }}>
                    <span className="mute">Быстрые действия</span>
                    <span className="dim mono" style={{ fontSize: 11 }}>
                      ⌘K
                    </span>
                  </div>
                  <div className="hero__side-item">Главная</div>
                  <div className="hero__side-item">
                    Уведомления{' '}
                    <span className="st st--solid" style={{ marginLeft: 6, height: 16, padding: '0 5px' }}>
                      {worked ? 3 : 2}
                    </span>
                  </div>
                  <div className="hero__side-item">Задачи</div>
                  <div className="hero__side-group">Таблицы</div>
                  <div className="hero__side-item is-on">Заказы</div>
                  <div className="hero__side-item">Клиенты</div>
                  <div className="hero__side-item">Изделия</div>
                  <div className="hero__side-item">Мастера</div>
                  <div className="hero__side-item">Остатки</div>
                  <div className="hero__side-group">Система</div>
                  <div className="hero__side-item">Автоматизации</div>
                  <div className="hero__side-item">Отчёты</div>
                </div>

                <div>
                  <div className="tbl__bar">
                    <div className="tbl__bar-l">
                      <b>Заказы</b>
                      <span className="dim">·</span>
                      <span className="mute">Все заказы</span>
                    </div>
                    <div className="tbl__bar-r">
                      <span className="st st--line">Фильтр</span>
                      <span className="st st--line">Вид</span>
                      <span className="st st--solid">+ Заказ</span>
                    </div>
                  </div>
                  <div className="tbl__head">
                    <span>№</span>
                    <span>Клиент</span>
                    <span>Изделие</span>
                    <span>Сумма</span>
                    <span>Статус</span>
                    <span>Мастер</span>
                    <span>Срок</span>
                  </div>
                  {ORDERS.map((o, i) => {
                    const first = i === 0
                    const label = first ? (worked ? 'В работе' : 'Оплачен') : REST[i - 1]
                    const cls = first ? (worked ? 'st--fill' : 'st--solid') : restClass(label)
                    return (
                      <div className={`tbl__row${first ? ' tbl__row--hot' : ''}`} key={o[0]}>
                        <span className="mono mute">{o[0]}</span>
                        <span>{o[1]}</span>
                        <span>{o[2]}</span>
                        <span>{o[3]}</span>
                        <span>
                          <span className={`st ${cls}`}>{label}</span>
                        </span>
                        <span>{o[4]}</span>
                        <span className="mute">{o[5]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="hero__float hero__float--tg ui" style={{ transform: `translateX(${-p * 40}px)`, opacity: built ? 0 : 1, pointerEvents: built ? 'none' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#1C1D1F' }} />
              <b>Lambda · уведомления</b>
              <span className="dim" style={{ marginLeft: 'auto' }}>
                12:04
              </span>
            </div>
            <div className="msg">
              Заказ <span className="mono">№1042</span> оплачен. Задача мастеру <b>Ильяс</b> · срок 12.09.
            </div>
            <div className="msg">Клиенту Анне отправлено: «заказ принят».</div>
            {worked && <div className="msg msg--new">Ильяс принял задачу · кольцо · золото 585.</div>}
          </div>

          <div className="hero__float hero__float--log" style={{ transform: `translateX(${-p * 40}px)`, opacity: built ? 0 : 1, pointerEvents: built ? 'none' : undefined }}>
            <div className="win__bar" style={{ padding: 0, height: 20 }}>
              <i style={{ background: '#3a3c40' }} />
              <i style={{ background: '#3a3c40' }} />
              <i style={{ background: '#3a3c40' }} />
            </div>
            <div>
              <span style={{ color: '#8F99A8' }}>12:04:11</span> правило «Оплата заказа»
            </div>
            <div>
              <span style={{ color: '#8F99A8' }}>12:04:11</span> → статус: в работе
            </div>
            <div>
              <span style={{ color: '#8F99A8' }}>12:04:11</span> → задача: Ильяс · до 12.09
            </div>
            <div>
              <span style={{ color: '#8F99A8' }}>12:04:12</span> → клиенту: «заказ принят»
            </div>
            <div>
              <span style={{ color: '#8F99A8' }}>12:04:12</span> → остаток: −1 · кольцо 585
            </div>
            <div style={{ color: '#fff' }}>4 действия · 0,3 с</div>
          </div>

          <div className="hero__float hero__float--card ui" style={{ transform: `translateX(${p * 40}px)`, opacity: built ? 0 : 1, pointerEvents: built ? 'none' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="avatar" style={{ width: 32, height: 32 }} />
              <div>
                <b>Анна Полякова</b>
                <div className="dim" style={{ fontSize: 12 }}>
                  клиент · 3 заказа
                </div>
              </div>
            </div>
            <div className="kv" style={{ marginTop: 12 }}>
              <span className="dim">Телефон</span>
              <span>+375 29 ··· ·· 41</span>
              <span className="dim">Размер</span>
              <span>17,5</span>
              <span className="dim">Источник</span>
              <span>Instagram</span>
            </div>
            <div style={{ marginTop: 12, borderTop: '1px solid var(--hair-weak)', paddingTop: 10, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <span className="dim">сегодня</span> · оплата 48 900
              </div>
              <div>
                <span className="dim">вчера</span> · заказ №1042 создан
              </div>
              <div>
                <span className="dim">02.09</span> · звонок · 4 мин
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Logos() {
  const row = [...LEFT_FOR_US, 'тетради', ...LEFT_FOR_US, 'тетради']
  return (
    <div className="logos section">
      <div className="frame logos__in">
        <div className="logos__cell">Ушли к нам из:</div>
        <div className="logos__marquee marquee-wrap">
          <div className="marquee">
            {row.map((n, i) => (
              <span className="logos__item" key={`${n}-${i}`}>
                {n}
              </span>
            ))}
          </div>
        </div>
        <div className="logos__cell logos__cell--flag">
          <span className="flag">[заменить]</span>
        </div>
      </div>
    </div>
  )
}
