import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Chip, Icon, Mark, Reveal, useReducedMotion } from './components/Ui'
import { STRUCTURES } from './data/structures'

const ORDERS = [
  {
    id: '1042',
    name: 'Анна Полякова',
    initials: 'АП',
    item: 'Кольцо · золото 585',
    sum: '48 900',
    master: 'Ильяс',
    date: '12.09',
    status: 'Ожидает оплаты',
  },
  {
    id: '1041',
    name: 'Дмитрий Лебедев',
    initials: 'ДЛ',
    item: 'Серьги · серебро',
    sum: '12 400',
    master: 'Марина',
    date: '10.09',
    status: 'В работе',
  },
  {
    id: '1040',
    name: 'Ольга Кузнецова',
    initials: 'ОК',
    item: 'Подвеска · золото',
    sum: '27 300',
    master: 'Ильяс',
    date: '09.09',
    status: 'В работе',
  },
  {
    id: '1039',
    name: 'Сергей Панов',
    initials: 'СП',
    item: 'Кольцо · платина',
    sum: '96 000',
    master: 'Артём',
    date: '15.09',
    status: 'Ожидает оплаты',
  },
  {
    id: '1038',
    name: 'Мария Орлова',
    initials: 'МО',
    item: 'Браслет · серебро',
    sum: '9 800',
    master: 'Марина',
    date: '05.09',
    status: 'Готов',
  },
]

const CORE = [
  {
    title: 'Связи',
    icon: 'link',
    heading: 'Одна база. Весь процесс.',
    text: 'Клиенты, заказы и задачи связаны. Выберите процесс — структура изменится.',
  },
  {
    title: 'Карточка',
    icon: 'table',
    heading: 'Весь контекст под рукой.',
    text: 'История, заказы и следующий шаг — в одной карточке клиента.',
  },
  {
    title: 'Аналитика',
    icon: 'chart',
    heading: 'Цифры уже собраны.',
    text: 'Отчёт берёт данные из CRM. Вы видите результат, пока команда работает.',
  },
]

function Header({ onRequest }: { onRequest: () => void }) {
  const [menu, setMenu] = useState(false)
  return (
    <header className="header">
      <div className="shell header-inner">
        <a className="brand" href="#top" aria-label="Lambda CRM — в начало">
          <Mark />
          <span>lmbd.crm</span>
        </a>
        <nav
          className={menu ? 'nav nav-open' : 'nav'}
          aria-label="Основная навигация"
        >
          {[
            ['#product', 'Возможности'],
            ['#automations', 'Автоматизации'],
            ['#implementation', 'Внедрение'],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="button button-dark button-small"
            onClick={onRequest}
          >
            Разобрать мой процесс <Icon name="arrow" size={15} />
          </button>
          <button
            className="icon-button menu-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label={menu ? 'Закрыть меню' : 'Открыть меню'}
          >
            <Icon name={menu ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}

function Workspace() {
  const [tab, setTab] = useState('Заказы')
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const searchRef = useRef<HTMLInputElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  const paid = step >= 1
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !document.querySelector('dialog[open]')
      ) {
        event.preventDefault()
        setTab('Заказы')
        requestAnimationFrame(() => {
          demoRef.current?.scrollIntoView({
            behavior: reduced ? 'auto' : 'smooth',
            block: 'center',
          })
          searchRef.current?.focus({ preventScroll: true })
        })
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [reduced])
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          if (!reduced) setRunning(true)
        }
      },
      { threshold: 0.6 },
    )
    if (demoRef.current) observer.observe(demoRef.current)
    return () => observer.disconnect()
  }, [reduced])
  useEffect(() => {
    if (!running) return
    if (reduced) {
      setStep(3)
      setRunning(false)
      return
    }
    if (step === 3) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(
      () => setStep((s) => s + 1),
      step === 0 ? 2200 : 1100,
    )
    return () => window.clearTimeout(timer)
  }, [running, step, reduced])
  const run = () => {
    setStep(0)
    setRunning(true)
    setTab('Заказы')
  }
  const filtered = ORDERS.filter((o) =>
    `${o.name} ${o.item} ${o.id}`.toLowerCase().includes(search.toLowerCase()),
  )
  return (
    <div className="hero-demo" ref={demoRef}>
      <div className="scene-label">
        <span>
          <span className="status-dot" /> Живой пример · ювелирный магазин
        </span>
        <span>
          попробуйте внутри <Icon name="arrow" size={14} />
        </span>
      </div>
      <div className="workspace">
        <aside className="workspace-sidebar">
          <div className="workspace-brand">
            <span className="store-icon">O</span>
            <div>
              <b>OKPODOLINS</b>
              <small>Рабочее пространство</small>
            </div>
          </div>
          <span className="sidebar-label">ВАША КОМАНДА</span>
          {['Заказы', 'Клиенты', 'Задачи'].map((t, i) => (
            <button
              key={t}
              aria-pressed={tab === t}
              onClick={() => {
                setTab(t)
                setSelected(null)
              }}
              className={tab === t ? 'sidebar-item selected' : 'sidebar-item'}
            >
              <Icon name={i === 1 ? 'ask' : 'table'} size={16} />
              {t}
              <span>
                {i === 2 ? (step >= 2 ? '3' : '2') : i === 0 ? '5' : '5'}
              </span>
            </button>
          ))}
          <div className="sidebar-bottom">
            <span className="avatar">М</span>
            <div>
              Марина<small>Администратор</small>
            </div>
            <span className="online-dot" />
          </div>
        </aside>
        <div className="workspace-main">
          <div className="workspace-toolbar">
            <div>
              <span className="breadcrumb">Рабочее пространство / </span>
              <b>{tab}</b>
            </div>
            <span className="demo-tag">ДЕМО</span>
          </div>
          <div className="workspace-title">
            <h3>{tab}</h3>
            {tab === 'Заказы' ? (
              <label className="search">
                <span aria-hidden="true">⌕</span>
                <input
                  ref={searchRef}
                  aria-label="Найти заказ"
                  placeholder="Найти заказ…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <kbd>⌘ K</kbd>
              </label>
            ) : (
              <Chip>
                {tab === 'Клиенты'
                  ? 'Вся история рядом'
                  : 'Сроки под контролем'}
              </Chip>
            )}
          </div>
          <div className="workspace-content" key={tab}>
            {tab === 'Заказы' && (
              <div className="table-scroll">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>№ заказа</th>
                      <th>Клиент</th>
                      <th>Изделие</th>
                      <th>Сумма, ₽</th>
                      <th>Статус</th>
                      <th>Мастер</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr
                        key={o.id}
                        className={o.id === '1042' && paid ? 'paid-row' : ''}
                      >
                        <td className="mono muted">{o.id}</td>
                        <td>
                          <button
                            className="name-button"
                            onClick={() => setSelected(ORDERS.indexOf(o))}
                          >
                            <span className="avatar">{o.initials}</span>
                            {o.name}
                          </button>
                        </td>
                        <td>{o.item}</td>
                        <td className="numeric">{o.sum}</td>
                        <td>
                          {o.id === '1042' ? (
                            <button
                              className="status-button"
                              disabled={running}
                              onClick={() => {
                                if (!running) {
                                  setStep(paid ? 0 : 1)
                                  setRunning(!paid)
                                }
                              }}
                              aria-label={
                                paid
                                  ? 'Сбросить оплату заказа 1042'
                                  : 'Отметить оплату заказа 1042'
                              }
                            >
                              <Chip active={paid}>
                                {paid ? 'Оплачен' : o.status}
                              </Chip>
                            </button>
                          ) : (
                            <Chip>{o.status}</Chip>
                          )}
                        </td>
                        <td>{o.master}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="empty-state">
                    Заказов не найдено. Попробуйте имя клиента или номер.
                  </p>
                )}
              </div>
            )}
            {tab === 'Клиенты' && (
              <div className="client-list">
                {ORDERS.map((o, i) => (
                  <button
                    key={o.id}
                    className="client-list-row"
                    onClick={() => setSelected(i)}
                  >
                    <span className="avatar">{o.initials}</span>
                    <b>{o.name}</b>
                    <span>Заказ №{o.id}</span>
                    <Icon name="arrow" size={16} />
                  </button>
                ))}
              </div>
            )}
            {tab === 'Задачи' && (
              <div className="tasks-list">
                {[
                  ...(step >= 2
                    ? [
                        {
                          text: 'Изготовить кольцо · заказ №1042',
                          owner: 'Ильяс · до 12.09',
                          auto: true,
                        },
                      ]
                    : []),
                  {
                    text: 'Проверить размер серёг',
                    owner: 'Марина · до 10.09',
                    auto: false,
                  },
                  {
                    text: 'Подготовить эскиз подвески',
                    owner: 'Ильяс · до 09.09',
                    auto: false,
                  },
                ].map((t) => (
                  <div className="task-row" key={t.text}>
                    <Icon name="check" />
                    <div>
                      <b>{t.text}</b>
                      <small>{t.owner}</small>
                    </div>
                    {t.auto && <Chip active>По правилу</Chip>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="workspace-bottom">
            <span>
              {tab === 'Задачи'
                ? `${step >= 2 ? 3 : 2} задачи`
                : tab === 'Заказы'
                  ? `Найдено: ${filtered.length} из 5`
                  : '5 клиентов'}{' '}
              <span className="muted">· все изменения сохранены</span>
            </span>
            <span className="connected">
              <Icon name="link" size={13} /> Всё связано
            </span>
          </div>
          {selected !== null && (
            <div
              className="record-panel"
              role="region"
              aria-label="Карточка клиента"
            >
              <button
                className="icon-button panel-close"
                onClick={() => setSelected(null)}
                aria-label="Закрыть карточку"
              >
                <Icon name="close" />
              </button>
              <span className="avatar avatar-large">
                {ORDERS[selected].initials}
              </span>
              <h3>{ORDERS[selected].name}</h3>
              <p className="muted">Клиент · ювелирный магазин</p>
              <div className="record-field">
                <span>Заказ</span>
                <b>№{ORDERS[selected].id}</b>
              </div>
              <div className="record-field">
                <span>Изделие</span>
                <b>{ORDERS[selected].item}</b>
              </div>
              <div className="record-field">
                <span>Мастер</span>
                <b>{ORDERS[selected].master}</b>
              </div>
              <div className="record-field">
                <span>Срок</span>
                <b>{ORDERS[selected].date}</b>
              </div>
              <div className="record-note">
                <Icon name="link" /> Данные из связанного заказа
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="scenario-bar">
        <div className={`scenario-event ${step >= 1 ? 'event-done' : ''}`}>
          <span className="event-icon">
            <Icon name="table" />
          </span>
          <div>
            <small>СОБЫТИЕ</small>
            <b>Заказ оплачен</b>
          </div>
        </div>
        <span className="flow-connector">
          <Icon name="arrow" />
        </span>
        <div className={`scenario-event ${step >= 2 ? 'event-done' : ''}`}>
          <span className="event-icon">
            <Icon name="check" />
          </span>
          <div>
            <small>АВТОМАТИЧЕСКИ</small>
            <b>Задача мастеру</b>
          </div>
        </div>
        <span className="flow-connector">
          <Icon name="arrow" />
        </span>
        <div className={`scenario-event ${step >= 3 ? 'event-done' : ''}`}>
          <span className="event-icon">
            <Icon name="ask" />
          </span>
          <div>
            <small>АВТОМАТИЧЕСКИ</small>
            <b>Клиент в курсе</b>
          </div>
        </div>
        <button
          className="replay"
          onClick={run}
          disabled={running}
          aria-label="Повторить сценарий оплаты"
        >
          <Icon name={running ? 'bolt' : 'replay'} size={16} />
          {running ? 'Выполняется' : 'Повторить'}
        </button>
      </div>
    </div>
  )
}

function Hero({ onRequest }: { onRequest: () => void }) {
  return (
    <section id="top" className="hero shell">
      <div className="hero-heading">
        <div>
          <div className="eyebrow">
            <span className="status-dot" /> LAMBDA CRM
          </div>
          <h1>
            CRM, собранная
            <br />
            под ваш процесс<span className="muted">.</span>
          </h1>
        </div>
        <div className="hero-aside">
          <p>
            Ваши данные, команда и правила.
            <br /> В одной системе, которую
            <br className="desktop-br" /> мы собираем под вас.
          </p>
          <button className="button button-dark" onClick={onRequest}>
            Разобрать мой процесс <Icon name="arrow" />
          </button>
          <span className="micro">30 минут · без обязательств</span>
        </div>
      </div>
      <Workspace />
      <div className="hero-foot">
        <span>
          Знакомые инструменты. <b>Ваша структура.</b>
        </span>
        <div>
          <span>Таблицы</span>
          <i />
          <span>Связи</span>
          <i />
          <span>Автоматизации</span>
          <i />
          <span>Права</span>
          <i />
          <span>Аналитика</span>
        </div>
      </div>
    </section>
  )
}

function StructurePreview() {
  const [process, setProcess] = useState(0)
  const spec = STRUCTURES[process]
  return (
    <div className="structure-preview">
      <div className="preview-topline">
        <span>
          <Icon name="link" /> Структура вашей CRM
        </span>
        <span className="mono">03 таблицы</span>
      </div>
      <div className="process-tabs" aria-label="Выберите процесс">
        {['Магазин', 'Услуги', 'Проекты'].map((t, i) => (
          <button
            key={t}
            aria-pressed={process === i}
            onClick={() => setProcess(i)}
            className={process === i ? 'is-active' : ''}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="schema-grid" key={process}>
        {spec.tables.map((table, i) => (
          <div
            className={`schema-table schema-table-${i}`}
            key={table.name}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="schema-table-title">
              <Icon name="table" />
              <b>{table.name}</b>
              <span>{String(i + 1).padStart(2, '0')}</span>
            </div>
            {table.fields.slice(0, 4).map((f) => (
              <div className="schema-field" key={f}>
                <span className="muted">
                  {f.includes('←') || f.includes('→') ? '↗' : '≡'}
                </span>
                {f.replace(/[←→]/g, '')}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="schema-rule" key={`${process}-rule`}>
        <span className="rule-mark">
          <Icon name="bolt" />
        </span>
        <span>{spec.automation[0]}</span>
        <Icon name="arrow" size={14} />
        <b>{spec.automation[1]}</b>
        <span className="schema-status">
          <Icon name="check" size={14} /> Связано
        </span>
      </div>
    </div>
  )
}

function ClientPreview() {
  const [active, setActive] = useState('История')
  return (
    <div className="client-preview">
      <div className="client-profile">
        <span className="avatar avatar-large">АП</span>
        <h3>Анна Полякова</h3>
        <span className="muted">Клиент с мая 2025</span>
        <Chip>Постоянный клиент</Chip>
        <div className="record-field">
          <span>Размер</span>
          <b>17,5</b>
        </div>
        <div className="record-field">
          <span>Мастер</span>
          <b>Ильяс</b>
        </div>
      </div>
      <div className="client-context">
        <div className="process-tabs">
          {['История', 'Заказы', 'Файлы'].map((t) => (
            <button
              key={t}
              aria-pressed={active === t}
              onClick={() => setActive(t)}
              className={active === t ? 'is-active' : ''}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="timeline" key={active}>
          {(active === 'История'
            ? [
                ['Оплата по заказу №1042', 'Сегодня, 12:04 · 48 900 ₽'],
                ['Задача мастеру создана', 'Сегодня, 12:04 · автоматически'],
                ['Заказ принят в работу', 'Вчера, 16:30'],
                ['Обсудили размер и эскиз', '02 сентября · звонок'],
              ]
            : active === 'Заказы'
              ? [
                  ['№1042 · Кольцо, золото 585', 'В работе · 48 900 ₽'],
                  ['№871 · Серьги', 'Выдан · 24 500 ₽'],
                  ['№640 · Подвеска', 'Выдан · 18 200 ₽'],
                ]
              : [
                  ['Эскиз кольца.pdf', 'Прикреплён к заказу №1042'],
                  ['Размеры изделия.jpg', 'Прикреплён к заказу №1042'],
                ]
          ).map(([title, meta], i) => (
            <div
              className="timeline-item"
              key={title}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="timeline-dot" />
              <b>{title}</b>
              <small>{meta}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsPreview() {
  const [period, setPeriod] = useState(0)
  const values =
    period === 0 ? [38, 50, 45, 66, 60, 84] : [45, 41, 58, 68, 79, 92]
  return (
    <div className="analytics-preview">
      <div className="preview-topline">
        <span>
          <Icon name="chart" /> Работа команды
        </span>
        <div className="process-tabs">
          {['Неделя', 'Месяц'].map((t, i) => (
            <button
              key={t}
              aria-pressed={period === i}
              className={period === i ? 'is-active' : ''}
              onClick={() => setPeriod(i)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="analytics-metrics">
        <div>
          <small>Выполнено заказов</small>
          <b key={period}>
            {period === 0 ? '23' : '94'}
            <span>за {period === 0 ? 'неделю' : 'месяц'}</span>
          </b>
        </div>
        <div>
          <small>Сданы в срок</small>
          <b>
            {period === 0 ? '91' : '96'}
            <span>%</span>
          </b>
        </div>
      </div>
      <div
        className="chart"
        role="img"
        aria-label={`Выполнено ${period === 0 ? 23 : 94} заказа, в срок ${period === 0 ? 91 : 96} процентов`}
      >
        <div className="chart-grid" />
        {values.map((v, i) => (
          <div className="bar-column" key={i}>
            <div
              className="bar"
              style={{ height: `${v}%`, transitionDelay: `${i * 60}ms` }}
            />
            <span>
              {
                (period === 0
                  ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
                  : ['01–05', '06–10', '11–15', '16–20', '21–25', '26–30'])[i]
              }
            </span>
          </div>
        ))}
      </div>
      <p className="chart-note">
        <span className="status-dot" /> На основе заказов и сроков ·
        демонстрационные данные
      </p>
    </div>
  )
}

function Product() {
  const [active, setActive] = useState(0)
  const data = CORE[active]
  return (
    <section id="product" className="section shell">
      <Reveal className="split-section">
        <div className="section-copy">
          <span className="eyebrow">01 / ГИБКОЕ ЯДРО</span>
          <h2>
            Всё связано.
            <br />
            <span className="muted">И всё на месте.</span>
          </h2>
          <p>
            Готовые возможности.
            <br />
            Структура под ваш бизнес.
          </p>
          <div
            className="feature-tabs"
            role="tablist"
            aria-label="Возможности CRM"
          >
            {CORE.map((t, i) => (
              <button
                key={t.title}
                role="tab"
                id={`core-tab-${i}`}
                aria-controls="core-preview"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const n =
                      (active +
                        (e.key === 'ArrowDown' ? 1 : -1) +
                        CORE.length) %
                      CORE.length
                    setActive(n)
                    document.getElementById(`core-tab-${n}`)?.focus()
                  }
                }}
                className={active === i ? 'feature-tab active' : 'feature-tab'}
              >
                <Icon name={t.icon} />
                <span>{t.title}</span>
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <div
            className="feature-preview"
            role="tabpanel"
            id="core-preview"
            aria-labelledby={`core-tab-${active}`}
          >
            <div key={active} className="preview-transition">
              {active === 0 ? (
                <StructurePreview />
              ) : active === 1 ? (
                <ClientPreview />
              ) : (
                <AnalyticsPreview />
              )}
            </div>
          </div>
          <div className="preview-caption">
            <b>{data.heading}</b>
            <span>{data.text}</span>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

const RULES = [
  {
    trigger: 'Заказ оплачен',
    actions: [
      'Создать задачу мастеру',
      'Поставить срок: 3 дня',
      'Уведомить клиента',
    ],
    log: [
      'Задача назначена Ильясу',
      'Срок установлен: 12 сентября',
      'Анна получила уведомление',
    ],
  },
  {
    trigger: 'Новая заявка',
    actions: [
      'Назначить менеджера',
      'Поставить задачу: перезвонить',
      'Напомнить через 15 минут',
    ],
    log: [
      'Ответственная — Марина',
      'Задача на звонок создана',
      'Напоминание запланировано',
    ],
  },
  {
    trigger: 'Остаток ниже минимума',
    actions: [
      'Создать заявку на закупку',
      'Назначить ответственного',
      'Уведомить руководителя',
    ],
    log: [
      'Заявка на закупку создана',
      'Ответственный назначен',
      'Руководитель получил уведомление',
    ],
  },
]

function Automations() {
  const [rule, setRule] = useState(0)
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (!running) return
    if (reduced) {
      setStep(3)
      setRunning(false)
      return
    }
    if (step === 3) {
      setRunning(false)
      return
    }
    const timeout = window.setTimeout(() => setStep((s) => s + 1), 650)
    return () => window.clearTimeout(timeout)
  }, [step, running, reduced])
  const data = RULES[rule]
  return (
    <section id="automations" className="section automation-section shell">
      <Reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / АВТОМАТИЗАЦИИ</span>
            <h2>
              Одно действие.
              <br />
              <span className="muted">Дальше — само.</span>
            </h2>
          </div>
          <p>
            Задачи, сроки и уведомления
            <br />
            запускаются по вашим правилам.
          </p>
        </div>
        <div className="automation-grid">
          <div className="automation-canvas">
            <div className="preview-topline">
              <span>
                <Icon name="bolt" /> Правило
              </span>
              <label className="rule-select">
                <span className="sr-only">Выбрать правило</span>
                <select
                  value={rule}
                  onChange={(e) => {
                    setRule(Number(e.target.value))
                    setStep(0)
                    setRunning(false)
                  }}
                >
                  {RULES.map((r, i) => (
                    <option key={r.trigger} value={i}>
                      {r.trigger}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flow" key={rule}>
              <div
                className={`flow-node trigger-node ${running || step ? 'node-done' : ''}`}
              >
                <span className="node-icon">
                  <Icon name="bolt" />
                </span>
                <div>
                  <small>КОГДА</small>
                  <b>{data.trigger}</b>
                </div>
                <span className="node-dot" />
              </div>
              {data.actions.map((action, i) => (
                <div className="flow-step" key={action}>
                  <div className={`flow-line ${step > i ? 'line-done' : ''}`} />
                  <div className={`flow-node ${step > i ? 'node-done' : ''}`}>
                    <span className="node-number">
                      {step > i ? <Icon name="check" size={15} /> : `0${i + 1}`}
                    </span>
                    <b>{action}</b>
                    <Icon name={step > i ? 'check' : 'plus'} size={14} />
                  </div>
                </div>
              ))}
            </div>
            <div className="automation-run">
              <span className="micro">
                {step === 3
                  ? 'Все 3 действия выполнены'
                  : 'Нажмите, чтобы увидеть результат'}
              </span>
              <button
                className="button button-dark button-small"
                disabled={running}
                onClick={() => {
                  setStep(0)
                  setRunning(true)
                }}
              >
                <Icon name={step === 3 ? 'replay' : 'play'} size={14} />
                {running
                  ? 'Выполняется…'
                  : step === 3
                    ? 'Повторить'
                    : 'Запустить'}
              </button>
            </div>
          </div>
          <div className="activity-card">
            <div>
              <span className="eyebrow">
                <span className="status-dot" /> ЖИВАЯ ЛЕНТА
              </span>
              <h3>Каждый шаг виден.</h3>
              <p>
                Кому поставлена задача.
                <br />
                Что сработало. Что дальше.
              </p>
            </div>
            <div className="activity-feed" aria-live="polite">
              <div className="activity-feed-item">
                <span className="activity-icon">
                  <Icon name="table" />
                </span>
                <div>
                  <b>{data.trigger}</b>
                  <small>Событие в CRM</small>
                </div>
                <span className="micro">сейчас</span>
              </div>
              {data.log.map((t, i) => (
                <div
                  key={`${rule}-${t}`}
                  aria-hidden={step <= i}
                  className={`activity-feed-item log-item ${step > i ? 'log-visible' : ''}`}
                >
                  <span className="activity-icon">
                    <Icon name={i === 2 ? 'ask' : 'check'} />
                  </span>
                  <div>
                    <b>{t}</b>
                    <small>Правило «{data.trigger}»</small>
                  </div>
                  <Icon name="check" size={14} />
                </div>
              ))}
            </div>
            <div className="activity-footer">
              <Icon name="link" size={16} /> Одно событие связывает весь процесс
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Team() {
  const [role, setRole] = useState(0)
  const roles = ['Мастер', 'Менеджер', 'Руководитель']
  const visible =
    role === 0 ? ORDERS.filter((o) => o.master === 'Ильяс') : ORDERS.slice(0, 4)
  return (
    <section id="team" className="team-section">
      <div className="shell">
        <Reveal className="split-section team-split">
          <div className="section-copy">
            <span className="eyebrow">03 / КОМАНДА И ДОСТУПЫ</span>
            <h2>
              Общая система.
              <br />
              <span className="muted">Каждому — своё.</span>
            </h2>
            <p>
              Мастер видит свои задачи.
              <br />
              Руководитель — весь бизнес.
            </p>
            <div className="role-buttons" aria-label="Посмотреть CRM от имени">
              {roles.map((r, i) => (
                <button
                  key={r}
                  aria-pressed={role === i}
                  onClick={() => setRole(i)}
                  className={role === i ? 'active' : ''}
                >
                  <Icon
                    name={i === 2 ? 'chart' : i === 1 ? 'table' : 'lock'}
                    size={16}
                  />
                  {r}
                  <Icon name={role === i ? 'check' : 'plus'} size={15} />
                </button>
              ))}
            </div>
          </div>
          <div className="permissions-window">
            <div className="permissions-top">
              <span>
                <Icon name="lock" size={16} /> Рабочее пространство
              </span>
              <Chip>{roles[role]}</Chip>
            </div>
            <div className="permission-person">
              <span className="avatar">
                {role === 0 ? 'И' : role === 1 ? 'М' : 'А'}
              </span>
              <div>
                <b>
                  {role === 0 ? 'Ильяс' : role === 1 ? 'Марина' : 'Алексей'}
                </b>
                <small>
                  {role === 0
                    ? 'Мои заказы'
                    : role === 1
                      ? 'Все заказы и клиенты'
                      : 'Все данные компании'}
                </small>
              </div>
              <span className="micro">ВИД ОТ ЛИЦА СОТРУДНИКА</span>
            </div>
            <div className="permission-table" key={role}>
              <div
                className={`permission-row permission-head ${role > 0 ? 'has-money' : ''}`}
              >
                <span>Изделие</span>
                <span>Срок</span>
                {role > 0 && <span>Сумма, ₽</span>}
              </div>
              {visible.map((o, i) => (
                <div
                  key={o.id}
                  className={`permission-row ${role > 0 ? 'has-money' : ''}`}
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span>
                    {o.item}
                    <small>
                      №{o.id} · {o.master}
                    </small>
                  </span>
                  <span>{o.date}</span>
                  {role > 0 && <b>{o.sum}</b>}
                </div>
              ))}
            </div>
            <div className="permission-note">
              <Icon name={role === 2 ? 'chart' : 'lock'} size={15} />
              <span>
                {role === 0
                  ? 'Финансы и чужие заказы скрыты'
                  : role === 1
                    ? 'Клиенты и суммы доступны менеджеру'
                    : 'Заказы, финансы и аналитика доступны полностью'}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const STEPS = [
  {
    title: 'Разбираемся в процессе',
    text: 'На встрече вы рассказываете, как работает команда. Мы находим связи, ручные шаги и то, что можно упростить.',
    label: 'Ваш процесс',
    tags: ['Клиент', 'Заказ', 'Мастер', 'Оплата'],
  },
  {
    title: 'Собираем вашу систему',
    text: 'Проектируем таблицы, связываем данные, настраиваем правила. Вы смотрите рабочую версию и даёте обратную связь.',
    label: 'Ваша структура',
    tags: ['Таблицы', 'Связи', 'Правила', 'Права'],
  },
  {
    title: 'Запускаем и развиваем',
    text: 'Переносим данные и обучаем команду. Новые процессы добавляем в систему по мере роста бизнеса.',
    label: 'Ваша команда',
    tags: ['Данные перенесены', 'Команда обучена', 'Можно работать'],
  },
]
const FAQ = [
  [
    'Это готовая CRM или разработка?',
    'Ядро готово: таблицы, связи, автоматизации, права и отчёты. Структуру под ваш бизнес проектирует и настраивает наша команда.',
  ],
  [
    'Сколько стоит и как долго внедрять?',
    'Стоимость и срок зависят от процесса, объёма данных и интеграций. После разбора согласуем состав работ, стоимость и план запуска.',
  ],
  [
    'Что будет с данными из старой CRM?',
    'Перенесём данные из таблиц и выгрузок в новую структуру. Вместе проверим записи и связи до запуска.',
  ],
  [
    'А если наш процесс изменится?',
    'Добавим новые таблицы, правила и отчёты к существующей структуре. Объём изменений и условия поддержки согласуем отдельно.',
  ],
]

function Implementation({ onRequest }: { onRequest: () => void }) {
  const [step, setStep] = useState(0)
  const [faq, setFaq] = useState<number | null>(null)
  return (
    <section id="implementation" className="section shell implementation">
      <Reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">04 / ВНЕДРЕНИЕ</span>
            <h2>
              Вы знаете бизнес.
              <br />
              <span className="muted">Мы соберём систему.</span>
            </h2>
          </div>
          <button className="button button-outline" onClick={onRequest}>
            Начнём с вашего процесса <Icon name="arrow" />
          </button>
        </div>
        <div className="implementation-grid">
          <div className="steps">
            {STEPS.map((s, i) => (
              <div
                className={`step-item ${step === i ? 'active' : ''}`}
                key={s.title}
              >
                <button
                  aria-expanded={step === i}
                  aria-controls={`step-content-${i}`}
                  onClick={() => setStep(i)}
                >
                  <span className="mono step-number">0{i + 1}</span>
                  <b>{s.title}</b>
                  <Icon name={step === i ? 'check' : 'plus'} />
                </button>
                <div
                  className="step-description"
                  id={`step-content-${i}`}
                  hidden={step !== i}
                >
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="implementation-visual" key={step}>
            <div className="implementation-stamp">
              <Mark />
              <span>LAMBDA CRM</span>
              <span className="mono">0{step + 1} / 03</span>
            </div>
            <div className="implementation-visual-body">
              <span className="implementation-symbol">
                <Icon
                  name={step === 0 ? 'ask' : step === 1 ? 'link' : 'check'}
                  size={28}
                />
              </span>
              <h3>{STEPS[step].label}</h3>
              <div className="implementation-tags">
                {STEPS[step].tags.map((t, i) => (
                  <span key={t} style={{ animationDelay: `${i * 100}ms` }}>
                    {step === 2 && <Icon name="check" size={13} />}
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="step-track">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  className={step >= i ? 'active' : ''}
                  onClick={() => setStep(i)}
                  aria-label={`Шаг ${i + 1}: ${s.title}`}
                  aria-pressed={step === i}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="faq" id="faq">
          <h3>Ещё пара деталей.</h3>
          <div>
            {FAQ.map(([q, a], i) => (
              <div className={`faq-item ${faq === i ? 'active' : ''}`} key={q}>
                <button
                  aria-expanded={faq === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  <span>{q}</span>
                  <Icon name={faq === i ? 'close' : 'plus'} size={17} />
                </button>
                <div className="faq-answer" id={`faq-${i}`} hidden={faq !== i}>
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function RequestDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [saved, setSaved] = useState(false)
  const [draft] = useState(() => {
    try {
      const value = JSON.parse(
        localStorage.getItem('lambda-gumloop-request-draft') || '{}',
      )
      return value && typeof value === 'object'
        ? (value as Record<string, unknown>)
        : {}
    } catch {
      return {}
    }
  })
  const [name, setName] = useState(
    typeof draft.name === 'string' ? draft.name : '',
  )
  const [company, setCompany] = useState(
    typeof draft.company === 'string' ? draft.company : '',
  )
  const [contact, setContact] = useState(
    typeof draft.contact === 'string' ? draft.contact : '',
  )
  const [process, setProcess] = useState(
    typeof draft.process === 'string' ? draft.process : '',
  )
  const [error, setError] = useState('')
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.showModal()
    return () => {
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [])
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !company.trim() || !contact.trim()) {
      setError('Заполните имя, компанию и контакт.')
      return
    }
    try {
      localStorage.setItem(
        'lambda-gumloop-request-draft',
        JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          contact: contact.trim(),
          process: process.trim(),
        }),
      )
      setSaved(true)
      setError('')
    } catch {
      setError('Браузер не разрешил сохранить черновик. Попробуйте ещё раз.')
    }
  }
  return (
    <dialog
      aria-labelledby="request-title"
      className="request-dialog"
      ref={ref}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          aria-label="Закрыть форму"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <span className="eyebrow">НАЧНЁМ С РАЗГОВОРА</span>
        {saved ? (
          <>
            <h2 id="request-title">Черновик сохранён.</h2>
            <p>
              Данные сохранены в этом браузере. В этой версии лендинга заявка
              ещё не отправляется команде.
            </p>
            <div className="saved-actions">
              <button className="button button-dark" onClick={onClose}>
                Готово <Icon name="check" />
              </button>
              <button
                className="button button-outline"
                onClick={() => {
                  try {
                    localStorage.removeItem('lambda-gumloop-request-draft')
                    setName('')
                    setCompany('')
                    setContact('')
                    setProcess('')
                    setSaved(false)
                  } catch {
                    setError('Не удалось удалить черновик.')
                  }
                }}
              >
                Удалить черновик
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>
              Разберём
              <br />
              ваш процесс.
            </h2>
            <p>
              30 минут, чтобы понять, как работает команда
              <br />и какой может быть ваша CRM.
            </p>
            <form onSubmit={save}>
              <div className="form-row">
                <label>
                  Ваше имя
                  <input
                    required
                    value={name}
                    autoComplete="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться"
                  />
                </label>
                <label>
                  Компания
                  <input
                    required
                    value={company}
                    autoComplete="organization"
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Название компании"
                  />
                </label>
              </div>
              <label>
                Телефон или Telegram
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+375 или @username"
                />
              </label>
              <label>
                Что хотите упростить?
                <textarea
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  placeholder="Пара слов о вашем процессе"
                  rows={3}
                />
              </label>
              {error && <p role="alert">{error}</p>}
              <button className="button button-dark" type="submit">
                Сохранить черновик <Icon name="arrow" />
              </button>
              <span className="form-note">
                Предпросмотр формы. Данные сохраняются только в этом браузере,
                без отправки.
              </span>
            </form>
          </>
        )}
      </div>
    </dialog>
  )
}

export default function App() {
  const [request, setRequest] = useState(false)
  const openRequest = () => setRequest(true)
  return (
    <>
      <a className="skip-link" href="#product">
        Перейти к возможностям
      </a>
      <Header onRequest={openRequest} />
      <main>
        <Hero onRequest={openRequest} />
        <Product />
        <Automations />
        <Team />
        <Implementation onRequest={openRequest} />
        <section className="closing">
          <div className="shell">
            <Reveal>
              <span className="closing-mark">
                <Mark />
              </span>
              <span className="eyebrow">ВАШ ПРОЦЕСС. ВАША CRM.</span>
              <h2>
                Пусть система работает
                <br />
                <span className="muted">по вашим правилам.</span>
              </h2>
              <button className="button button-dark" onClick={openRequest}>
                Разобрать мой процесс <Icon name="arrow" />
              </button>
              <span className="micro">
                30 минут · без обязательств · ничего готовить не нужно
              </span>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="footer shell">
        <a href="#top" className="brand">
          <Mark />
          lmbd.crm
        </a>
        <span>© 2026 Lambda CRM</span>
        <a href="#faq">
          Вопросы и ответы <Icon name="arrow" size={14} />
        </a>
        <button onClick={openRequest}>
          Обсудить процесс <Icon name="arrow" size={14} />
        </button>
      </footer>
      {request && <RequestDialog onClose={() => setRequest(false)} />}
    </>
  )
}
