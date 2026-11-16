import { useState, type FormEvent } from 'react'
import { STATS, CASES, UPDATES, FAQ, FOOTER, NAV, CLOSING_ORBIT } from '../data/content'
import { useInViewRepeat, useCountUp, useOrbit, useScrollTrack } from '../lib/motion'
import { Reveal, Wordmark } from '../components/Ui'

/* ——— Что меняется: числа досчитываются при каждом входе в кадр ——— */

function Stat({ prefix, n, suffix, label }: { prefix: string; n: number; suffix: string; label: string }) {
  const [ref, value] = useCountUp(n, 900)
  return (
    <div className="stats__item">
      <div className="stats__num">
        {prefix}
        <span ref={ref}>{value}</span>
        {suffix}
      </div>
      <div className="stats__label">{label}</div>
    </div>
  )
}

export function Stats() {
  const [ref, inView] = useInViewRepeat<HTMLDivElement>(0.3)

  return (
    <section className="stats section">
      <div className="frame" style={{ position: 'relative' }}>
        <div className="stats__bg" />
        <svg className="stats__curve" viewBox="0 0 1000 760" preserveAspectRatio="none" fill="none">
          <path
            className={`line-draw${inView ? ' is-in' : ''}`}
            d="M0 700 C 200 700, 360 660, 500 560 S 760 300, 860 170 S 960 40, 1000 0"
            stroke="#1C1D1F"
            strokeWidth="2"
          />
        </svg>
        <div className="stats__in" ref={ref}>
          <Reveal>
            <span className="pill">Что меняется</span>
          </Reveal>
          <Reveal>
            <h2 className="h2" style={{ maxWidth: 464 }}>
              Что меняется в ежедневной работе.{' '}
              <span className="g">
                Оценки по внедрениям; результат зависит от процессов компании и объёма внедрения.
              </span>
            </h2>
          </Reveal>
          <div className="stats__grid">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <Stat {...s} />
              </Reveal>
            ))}
          </div>
          <div className="cap">
            на разборе покажем, откуда берётся каждая цифра для вашего случая
          </div>
        </div>
      </div>
    </section>
  )
}

/* ——— Кейсы: закреплённая секция, карточки едут вбок по мере скролла ——— */

const STOCK = [
  ['Кольцо · 17,5', '2', '3', 'заказ поставщику'],
  ['Кольцо · 18', '4 → 3', '3', '—'],
  ['Серьги · пусеты', '7', '4', '—'],
  ['Цепочка · 45 см', '5', '2', '—'],
]

const INBOX = [
  ['сайт · форма', 'Ремонт кольца', 'Марина', 'через 1 мин'],
  ['пропущенный', '+375 29 ··· ·· 08', 'Ильяс', 'через 1 мин'],
  ['Telegram', 'Гравировка, срочно', 'Марина', 'через 2 мин'],
]

function CaseMedia({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="win ui" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--hair-weak)' }}>
          <b>Остатки · золото 585</b>
          <span className="st st--alert">ниже минимума: 1</span>
        </div>
        <div className="dim" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 130px', padding: '8px 16px', fontSize: 12 }}>
          <span>Позиция</span>
          <span>Остаток</span>
          <span>Минимум</span>
          <span>Заказ</span>
        </div>
        {STOCK.map((r, n) => (
          <div
            key={r[0]}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 80px 130px',
              padding: '10px 16px',
              borderTop: '1px solid var(--hair-weak)',
              background: n === 1 ? 'var(--surface)' : undefined,
            }}
          >
            <span>{r[0]}</span>
            <span>{r[1]}</span>
            <span>{r[2]}</span>
            <span>{r[3] === '—' ? <span className="dim">—</span> : <span className="st st--solid">{r[3]}</span>}</span>
          </div>
        ))}
      </div>
    )

  if (i === 1)
    return (
      <div className="win ui" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--hair-weak)' }}>
          <b>Заявки · сегодня</b>
          <span className="st st--fill">3 новые</span>
        </div>
        <div className="dim" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 120px', padding: '8px 16px', fontSize: 12 }}>
          <span>Источник</span>
          <span>Что нужно</span>
          <span>Ответственный</span>
          <span>Задача</span>
        </div>
        {INBOX.map((r) => (
          <div key={r[1]} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 120px', padding: '10px 16px', borderTop: '1px solid var(--hair-weak)' }}>
            <span className="mute">{r[0]}</span>
            <span>{r[1]}</span>
            <span>{r[2]}</span>
            <span>
              <span className="st st--solid">{r[3]}</span>
            </span>
          </div>
        ))}
      </div>
    )

  return (
    <div className="win ui" style={{ width: '100%', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <b>Проекты · сроки и выработка</b>
        <span className="st st--fill">обновлено 2 мин назад</span>
      </div>
      <div className="bars" style={{ height: 130 }}>
        {[
          [62, 28, 10],
          [70, 22, 8],
          [58, 36, 6],
          [74, 22, 4],
          [80, 18, 2],
        ].map((c, n) => (
          <div className="bars__col is-in" key={n} style={{ transitionDelay: `${n * 90}ms` }}>
            <div className="bars__seg--a" style={{ height: `${c[0]}%`, borderRadius: '3px 3px 0 0' }} />
            <div className="bars__seg--b" style={{ height: `${c[1]}%` }} />
            <div className="bars__seg--c" style={{ height: `${c[2]}%`, borderRadius: '0 0 3px 3px' }} />
          </div>
        ))}
      </div>
      <div className="dim" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, padding: '6px 6px 0' }}>
        {['апр', 'май', 'июн', 'июл', 'авг'].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  )
}

function CaseCard({ i }: { i: number }) {
  const c = CASES[i]
  return (
    <article className="track__card case-card">
      <div className="case-card__media">
        <CaseMedia i={i} />
      </div>
      <div className="case-card__text">
        <div className="cases__kicker">{c.kicker}</div>
        <div className="cases__h">
          {c.real ? c.number : <span className="flag">{c.number}</span>} {c.numberLabel}{' '}
          <span className="g">{c.title}</span>
        </div>
        <dl className="cases__ba">
          <dt>БЫЛО</dt>
          <dd className={c.real ? '' : 'flag'} style={c.real ? undefined : { whiteSpace: 'normal' }}>
            {c.before}
          </dd>
          <dt>СТАЛО</dt>
          <dd className={c.real ? '' : 'flag'} style={c.real ? undefined : { whiteSpace: 'normal' }}>
            {c.after}
          </dd>
        </dl>
        <div className="case-card__client">{c.client}</div>
      </div>
    </article>
  )
}

export function Cases() {
  const { wrapRef, rowRef, shift, progress, flat } = useScrollTrack()
  const cards = CASES.map((c, i) => <CaseCard key={c.client} i={i} />)

  return (
    <section className="section" id="cases">
      <div className="frame">
        <Reveal className="head head--row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <span className="pill">Кейсы</span>
            <h2 className="h2" style={{ maxWidth: 720 }}>
              Как это работает у клиентов.{' '}
              <span className="g">
                Три внедрения — три разные структуры. Общее одно: система повторяет процесс, а не
                наоборот.
              </span>
            </h2>
          </div>
          <span className="cap">прокручивайте — карточки едут вбок</span>
        </Reveal>
      </div>

      {flat ? (
        <div className="track--flat">
          <div className="track__row" ref={rowRef}>
            {cards}
          </div>
        </div>
      ) : (
        <div className="track" ref={wrapRef} style={{ height: `calc(100vh + ${Math.round(shift * 1.28)}px)` }}>
          <div className="track__pin">
            <div
              className="track__row"
              ref={rowRef}
              style={{ transform: `translate3d(${-(shift * progress).toFixed(1)}px, 0, 0)` }}
            >
              {cards}
            </div>
            <div className="track__bar">
              <span style={{ transform: `scaleX(${progress.toFixed(3)})` }} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ——— Обновления и полоса запроса ——— */

export function Updates() {
  const [sent, setSent] = useState(false)
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim().length < 5) {
      setShake(true)
      window.setTimeout(() => setShake(false), 160)
      return
    }
    setSent(true)
  }

  return (
    <section className="section" id="request">
      <div className="frame">
        <Reveal className="head head--row">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <span className="pill">
              За последний месяц <span className="flag">[опционально]</span>
            </span>
            <h2 className="h2" style={{ maxWidth: 880 }}>
              Развиваем после запуска.{' '}
              <span className="g">
                Новые таблицы и правила подключаются к работающей системе, не ломая её.
              </span>
            </h2>
          </div>
          <a className="btn btn--outline btn--sm" href="#request">
            Все обновления →
          </a>
        </Reveal>

        <div className="updates">
          {UPDATES.map((u, i) => (
            <Reveal key={u.title} delay={i * 60}>
              <div className="updates__item">
                <div className="updates__date">{u.date}</div>
                <div className="updates__title">{u.title}</div>
                <div className="updates__meta">
                  {u.meta} {i === 0 && <span className="flag">[заменить]</span>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="ask-strip">
          <div className="ask-strip__h">
            Разберём ваш процесс. <span className="g">Тридцать минут, без обязательств.</span>
          </div>
          {sent ? (
            <div className="ask-strip__ok">
              <span className="live-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--fg)', marginRight: 8 }} />
              Спасибо. Напишем в течение дня.
            </div>
          ) : (
            <form className={`ask-strip__form${shake ? ' shake' : ''}`} onSubmit={submit}>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Телефон или Telegram"
                aria-label="Телефон или Telegram"
              />
              <button className="btn btn--primary" type="submit">
                Разобрать →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ——— FAQ ——— */

export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section className="faq section" id="faq">
      <div className="frame faq__in">
        <Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'flex-start' }}>
            <span className="pill">Вопросы</span>
            <h2 className="h2" style={{ maxWidth: 460 }}>
              Вопросы, которые задают перед разбором.
            </h2>
          </div>
        </Reveal>
        <div>
          {FAQ.map((f, i) => (
            <div className={`faq__item${i === open ? ' is-open' : ''}`} key={f.q}>
              <button
                type="button"
                className="faq__q"
                aria-expanded={i === open}
                onClick={() => setOpen(i === open ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="faq__sign" aria-hidden="true">
                  +
                </span>
              </button>
              <div className="faq__a">
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ——— Closing: вопросы дышат вокруг заголовка ——— */

export function Closing() {
  const { wrap, setItem } = useOrbit(CLOSING_ORBIT.length, CLOSING_ORBIT)

  return (
    <section className="dark closing stripes-dark section" data-nav-dark>
      <div className="frame closing__in" style={{ position: 'relative' }}>
        <div className="orbit" ref={wrap} aria-hidden="true">
          {CLOSING_ORBIT.map((o, i) => (
            <span
              key={o.t}
              ref={setItem(i)}
              style={{ left: `${o.x}%`, top: `${o.y}%`, filter: `blur(${o.blur}px)`, animationDelay: `${200 + i * 120}ms` }}
            >
              {o.t}
            </span>
          ))}
        </div>
        <Reveal>
          <h2>
            Хватит подстраиваться под CRM.
            <br />
            Соберём одну под вас.
          </h2>
        </Reveal>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }}>
          <a className="btn btn--outline" href="#core">
            Посмотреть, как работает ↑
          </a>
          <a className="btn btn--primary" href="#request">
            Разобрать мой процесс
          </a>
        </div>
        <div className="cap">
          ответим в течение дня · 30 минут · без обязательств · ничего не нужно готовить
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="dark section" data-nav-dark>
      <div className="frame footer__in">
        <div>
          <div className="brand" style={{ color: 'var(--on-dark)' }}>
            <Wordmark light />
            <span>lmbd.crm</span>
          </div>
          <p className="footer__desc">
            Lambda CRM — ядро из гибких таблиц и структура, собранная под ваш бизнес.
          </p>
          <div className="footer__copy">© 2026 Lambda CRM</div>
        </div>
        {FOOTER.map((col) => (
          <div className="footer__col" key={col.title}>
            <b>{col.title}</b>
            {col.links.map((l) => {
              const anchor = NAV.find((n) => n.label === l)?.href
              return (
                <a key={l} href={anchor ?? '#request'}>
                  {l}
                </a>
              )
            })}
          </div>
        ))}
      </div>
    </footer>
  )
}
