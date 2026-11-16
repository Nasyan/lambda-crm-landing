import { useEffect, useRef, useState } from 'react'
import { BusinessGlobe, NETWORKS } from './components/BusinessGlobe'
import { Icon, Mark, Reveal, useReducedMotion } from './components/Ui'
import { RequestDialog } from './components/RequestDialog'

function LiveHeader({ onRequest }: { onRequest: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="live-header">
      <div className="shell">
        <a href="#top" className="brand" aria-label="Lambda CRM — в начало">
          <Mark />
          lmbd.crm
        </a>
        <nav className={open ? 'is-open' : ''} aria-label="Основная навигация">
          {[
            ['#how', 'Как работает'],
            ['#results', 'Что меняется'],
            ['#approach', 'Наш подход'],
          ].map(([href, label]) => (
            <a href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button className="button button-dark button-small" onClick={onRequest}>
          Разобрать мой процесс <Icon name="arrow" size={15} />
        </button>
        <button
          className="icon-button live-menu"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>
    </header>
  )
}

const HANDOFFS = [
  {
    title: 'Чат с мастером',
    solved: 'Задача мастеру',
    icon: 'ask',
    before: 'Ильяс, заказ оплачен. Возьмёшь кольцо?',
    after: 'Изготовить кольцо · Ильяс',
    meta: 'Прочитано. Ответа пока нет.',
    done: 'Связана с заказом №1042',
  },
  {
    title: 'Напоминание себе',
    solved: 'Срок назначен',
    icon: 'table',
    before: 'Не забыть: кольцо к пятнице.',
    after: '12 сентября · через 3 дня',
    meta: 'А кто напомнит мастеру?',
    done: 'В календаре исполнителя',
  },
  {
    title: 'Таблица остатков',
    solved: 'Склад обновлён',
    icon: 'chart',
    before: 'Кольцо 585 / 4 шт.',
    after: 'Кольцо 585 / 3 шт.',
    meta: 'Нужно списать вручную.',
    done: 'Списание связано с продажей',
  },
  {
    title: 'Сообщение клиента',
    solved: 'Клиент в курсе',
    icon: 'ask',
    before: 'Оплатила. Вы уже получили?',
    after: 'Анна, ваш заказ принят в работу.',
    meta: 'Ещё одно сообщение ждёт ответа.',
    done: 'Уведомление отправлено',
  },
]

function OneEvent() {
  const stage = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)
  const [running, setRunning] = useState(false)
  const [opened, setOpened] = useState<number | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.inView = String(entry.isIntersecting)
      },
      { threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!running) return
    if (reduced) {
      setPhase(5)
      setRunning(false)
      return
    }
    if (phase === 5) {
      setRunning(false)
      return
    }
    const t = window.setTimeout(
      () => setPhase((p) => p + 1),
      phase === 0 ? 180 : 570,
    )
    return () => clearTimeout(t)
  }, [phase, running, reduced])
  const connected = phase > 0
  const run = () => {
    setOpened(null)
    setPhase(0)
    setRunning(true)
  }
  return (
    <div
      ref={stage}
      className={`event-playground ${connected ? 'is-connected' : ''} ${opened !== null ? 'has-expanded-card' : ''}`}
    >
      <div className="playground-top">
        <span>
          <span className="status-dot" /> ОДИН ЗАКАЗ. ДВА СПОСОБА РАБОТАТЬ.
        </span>
        <div className="mode-switch" aria-label="Сравнить процесс">
          <button
            aria-pressed={!connected && !running}
            onClick={() => {
              setPhase(0)
              setRunning(false)
              setOpened(null)
            }}
          >
            Вручную
          </button>
          <button aria-pressed={connected || running} onClick={run}>
            С Lambda <Mark />
          </button>
        </div>
      </div>
      <div className="event-stage">
        <svg
          className="event-wires"
          viewBox="0 0 1200 430"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[
            'M500 170C340 170 400 94 258 94',
            'M700 170C860 170 800 94 945 94',
            'M500 245C330 245 405 339 258 339',
            'M700 245C870 245 800 339 945 339',
          ].map((d, i) => (
            <g key={d} className={phase > i + 1 ? 'wire-complete' : ''}>
              <path d={d} />
              <path d={d} pathLength={100} className="wire-signal" />
            </g>
          ))}
        </svg>
        <div className="event-origin">
          <div className="receipt-top">
            <Mark />
            <span>OKPODOLINS</span>
            <span>№1042</span>
          </div>
          <span className="receipt-kicker">КОЛЬЦО · ЗОЛОТО 585</span>
          <b className="receipt-amount">
            48 900<span>₽</span>
          </b>
          <span className="receipt-client">Анна Полякова</span>
          <div className="receipt-divider" />
          <button
            className="receipt-pay"
            disabled={running}
            onClick={
              connected
                ? () => {
                    setPhase(0)
                    setRunning(false)
                  }
                : run
            }
          >
            <Icon name={connected ? 'check' : 'play'} size={15} />
            {running
              ? 'Правило работает…'
              : connected
                ? 'Оплата отмечена'
                : 'Отметить оплату'}
            <Icon name={connected ? 'replay' : 'arrow'} size={14} />
          </button>
          <small>
            {connected
              ? 'Дальнейшие шаги знает CRM'
              : 'Попробуйте: что будет дальше?'}
          </small>
        </div>
        {HANDOFFS.map((item, i) => {
          const done = phase >= i + 2
          return (
            <button
              key={item.title}
              className={`handoff handoff-${i} ${done ? 'handoff-done' : ''} ${opened === i ? 'handoff-open' : ''}`}
              onClick={() => setOpened(opened === i ? null : i)}
              aria-expanded={opened === i}
            >
              <span className="handoff-heading">
                <Icon name={done ? 'check' : item.icon} size={15} />
                <span>{done ? item.solved : item.title}</span>
                <span className="handoff-index">0{i + 1}</span>
              </span>
              <span className="handoff-body" key={String(done)}>
                {done ? item.after : item.before}
              </span>
              <span className="handoff-meta">
                {done ? item.done : item.meta}
              </span>
              {opened === i && (
                <span className="handoff-detail">
                  {done
                    ? [
                        'Ответственный и заказ подставлены из CRM.',
                        'Срок рассчитан по правилу «Оплата заказа».',
                        'Остаток изменился в связанной таблице.',
                        'Уведомление сохранилось в истории клиента.',
                      ][i]
                    : [
                        'Откройте чат, найдите мастера, передайте контекст.',
                        'Запишите срок и проследите, чтобы его не пропустили.',
                        'Найдите товар и уменьшите остаток после продажи.',
                        'Ответьте клиенту и вернитесь к следующему заказу.',
                      ][i]}
                </span>
              )}
            </button>
          )
        })}
        <span className="stage-annotation">
          {connected ? 'Связи работают за вас.' : 'Пока всё связываете вы.'}
        </span>
      </div>
      <div className="playground-result">
        <div>
          <b key={connected ? 'after' : 'before'}>
            {connected ? '1 действие' : '4 ручных шага'}
          </b>
          <span>
            {connected
              ? 'Задача, срок, склад и сообщение — по правилу.'
              : 'И так после каждого оплаченного заказа.'}
          </span>
        </div>
        <div
          className="result-progress"
          role="progressbar"
          aria-label="Автоматизация заказа"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={Math.max(0, phase - 1)}
        >
          {HANDOFFS.map((_, i) => (
            <span key={i} className={phase >= i + 2 ? 'complete' : ''} />
          ))}
        </div>
        <span className="playground-footnote">
          Пример процесса · данные демонстрационные
        </span>
      </div>
    </div>
  )
}

function Hero({ onRequest }: { onRequest: () => void }) {
  return (
    <section id="top" className="living-hero shell">
      <div className="living-intro">
        <div>
          <span className="small-label">LAMBDA — CRM ПОД ВАШ БИЗНЕС</span>
          <h1>
            Работа — в одной CRM.
            <br /> <span className="serif-word">По вашим правилам.</span>
          </h1>
        </div>
        <div className="living-promise">
          <p>
            Заказы в таблицах. Задачи в чатах.
            <br /> А всё держится на вашей памяти.
          </p>
          <p>
            Мы связываем ваш процесс в одну систему.
            <br /> Повторяющиеся шаги она делает сама.
          </p>
          <button className="button button-dark" onClick={onRequest}>
            Разобрать мой процесс <Icon name="arrow" />
          </button>
          <span className="micro">30 минут · без обязательств</span>
        </div>
      </div>
      <OneEvent />
      <div className="real-case-strip">
        <span className="case-wordmark">OKPODOLINS</span>
        <p>
          Так уже работают заказы, мастера и остатки
          <br className="desktop-br" /> в магазине украшений.
        </p>
        <div>
          <b>6</b>
          <span>
            человек
            <br /> в команде
          </span>
        </div>
        <a href="#approach">
          Собрали под их процесс <Icon name="arrow" size={15} />
        </a>
      </div>
    </section>
  )
}

function ConnectedBusiness() {
  const [network, setNetwork] = useState(0),
    [active, setActive] = useState(0)
  const data = NETWORKS[network],
    detail = data.details[active]
  return (
    <section id="how" className="network-section shell">
      <Reveal>
        <div className="network-heading">
          <span className="small-label">КАК ЭТО УСТРОЕНО</span>
          <h2>
            У бизнеса много связей.
            <br /> У CRM должна быть <em>ваша структура.</em>
          </h2>
          <p>
            Клиент связан с заказом. Заказ — с мастером, оплатой и складом.
            <br /> Открываете запись — видите весь контекст.
          </p>
        </div>
        <div className="network-layout">
          <BusinessGlobe
            network={network}
            active={active}
            onSelect={setActive}
          />
          <div className="network-inspector">
            <div className="network-switch" aria-label="Пример бизнеса">
              {NETWORKS.map((n, i) => (
                <button
                  key={n.name}
                  aria-pressed={network === i}
                  onClick={() => {
                    setNetwork(i)
                    setActive(0)
                  }}
                >
                  {n.name}
                </button>
              ))}
            </div>
            <span className="inspector-label">ВЫБЕРИТЕ ЧАСТЬ ПРОЦЕССА</span>
            <div className="entity-select">
              {data.labels.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="inspector-record" key={`${network}-${active}`}>
              <span className="record-eyebrow">
                <Icon name="table" size={14} />
                {data.labels[active]}
                <span>СВЯЗАННАЯ ЗАПИСЬ</span>
              </span>
              <h3>{detail[0]}</h3>
              <p>{detail[1]}</p>
              <div className="inspector-links">
                {detail.slice(2).map((t, i) => (
                  <div key={t} style={{ animationDelay: `${i * 80}ms` }}>
                    <Icon name="link" size={14} />
                    <span>{t}</span>
                    <Icon name="arrow" size={13} />
                  </div>
                ))}
              </div>
              <span className="inspector-note">
                Данные вносятся один раз. Связи сохраняют контекст.
              </span>
            </div>
          </div>
        </div>
        <div className="network-takeaway">
          <span>Ядро уже готово: таблицы, связи, правила и права.</span>
          <b>Набор записей и полей проектируем под вашу работу.</b>
        </div>
      </Reveal>
    </section>
  )
}

const VIEWS = [
  {
    role: 'Мастеру',
    question: 'Что делать дальше?',
    result: 'Следующая задача уже на месте.',
    text: 'Видны свой заказ, срок и всё, что нужно для работы.',
  },
  {
    role: 'Менеджеру',
    question: 'Что обещали клиенту?',
    result: 'История не остаётся в чужом чате.',
    text: 'Заказ, оплата и договорённости собраны в карточке.',
  },
  {
    role: 'Руководителю',
    question: 'Где застряла работа?',
    result: 'Ответ в данных. Без «сведи к пятнице».',
    text: 'Понятно, на каком этапе заказы и кому нужна помощь.',
  },
]
function Results() {
  const [view, setView] = useState(0),
    [done, setDone] = useState(false),
    [sketchDone, setSketchDone] = useState(false),
    [selectedTask, setSelectedTask] = useState(0),
    [filter, setFilter] = useState(false),
    [history, setHistory] = useState('История')
  return (
    <section id="results" className="results-section">
      <div className="shell">
        <Reveal>
          <div className="results-heading">
            <span className="small-label">ЧТО МЕНЯЕТСЯ В РАБОТЕ</span>
            <h2>
              Меньше «напомни».
              <br /> Больше <em>сделано.</em>
            </h2>
            <p>
              Каждый видит свою часть работы.
              <br /> И знает, что делать дальше.
            </p>
          </div>
          <div className="results-layout">
            <div
              className="role-view-tabs"
              role="tablist"
              aria-label="Результат для команды"
            >
              {VIEWS.map((v, i) => (
                <button
                  key={v.role}
                  role="tab"
                  aria-selected={view === i}
                  aria-controls="work-screen"
                  id={`view-${i}`}
                  tabIndex={view === i ? 0 : -1}
                  onClick={() => setView(i)}
                  onKeyDown={(event) => {
                    const direction = ['ArrowRight', 'ArrowDown'].includes(
                      event.key,
                    )
                      ? 1
                      : ['ArrowLeft', 'ArrowUp'].includes(event.key)
                        ? -1
                        : 0
                    if (!direction && !['Home', 'End'].includes(event.key))
                      return
                    event.preventDefault()
                    const next =
                      event.key === 'Home'
                        ? 0
                        : event.key === 'End'
                          ? VIEWS.length - 1
                          : (i + direction + VIEWS.length) % VIEWS.length
                    setView(next)
                    document.getElementById(`view-${next}`)?.focus()
                  }}
                >
                  <span>0{i + 1}</span>
                  <b>{v.role}</b>
                  <small>{v.question}</small>
                  <Icon name="arrow" size={17} />
                </button>
              ))}
            </div>
            <div
              className="work-view"
              role="tabpanel"
              id="work-screen"
              aria-labelledby={`view-${view}`}
            >
              <div className="work-topline">
                <span>
                  <Mark /> OKPODOLINS
                </span>
                <span className="work-person">
                  {view === 0
                    ? 'Ильяс · мастер'
                    : view === 1
                      ? 'Марина · менеджер'
                      : 'Алексей · руководитель'}
                </span>
              </div>
              <div className="work-content" key={view}>
                {view === 0 ? (
                  <>
                    <div className="work-title">
                      <h3>На сегодня</h3>
                      <span>
                        {done && sketchDone
                          ? 'Всё готово'
                          : done || sketchDone
                            ? '1 задача'
                            : '2 задачи'}
                      </span>
                    </div>
                    <button
                      className={`work-task ${done ? 'task-complete' : ''}`}
                      onClick={() => {
                        setDone(!done)
                        setSelectedTask(0)
                      }}
                      aria-pressed={done}
                    >
                      <span className="task-check">
                        {done && <Icon name="check" size={14} />}
                      </span>
                      <span>
                        <b>Изготовить кольцо · золото 585</b>
                        <small>№1042 · Анна Полякова · размер 17,5</small>
                      </span>
                      <span className="task-date">
                        {done ? 'Готово' : '12.09'}
                      </span>
                    </button>
                    <button
                      className={`work-task ${sketchDone ? 'task-complete' : ''}`}
                      aria-pressed={sketchDone}
                      onClick={() => {
                        setSketchDone(!sketchDone)
                        setSelectedTask(1)
                      }}
                    >
                      <span className="task-check">
                        {sketchDone && <Icon name="check" size={14} />}
                      </span>
                      <span>
                        <b>Подготовить эскиз подвески</b>
                        <small>№1040 · Ольга Кузнецова</small>
                      </span>
                      <span className="task-date">
                        {sketchDone ? 'Готово' : '09.09'}
                      </span>
                    </button>
                    <div className="work-context">
                      <span className="context-line">
                        <Icon name="bolt" size={14} /> Создано правилом «Оплата
                        заказа»
                      </span>
                      <p>
                        {(selectedTask === 0 ? done : sketchDone)
                          ? 'Заказ обновлён. Менеджер видит, что работа готова.'
                          : 'Отметьте задачу — статус заказа изменится вместе с ней.'}
                      </p>
                      <span className="work-status">
                        Заказ №{selectedTask === 0 ? '1042' : '1040'}{' '}
                        <b key={`${selectedTask}-${done}-${sketchDone}`}>
                          {selectedTask === 0
                            ? done
                              ? 'Готов к выдаче'
                              : 'В работе'
                            : sketchDone
                              ? 'Эскиз готов'
                              : 'Эскиз в работе'}
                        </b>
                      </span>
                    </div>
                  </>
                ) : view === 1 ? (
                  <>
                    <div className="work-client">
                      <span className="avatar avatar-large">АП</span>
                      <div>
                        <h3>Анна Полякова</h3>
                        <small>Клиент с мая 2025 · 3 заказа</small>
                      </div>
                    </div>
                    <div className="work-history-tabs">
                      {['История', 'Договорённости'].map((t) => (
                        <button
                          key={t}
                          aria-pressed={history === t}
                          onClick={() => setHistory(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="work-timeline" key={history}>
                      {(history === 'История'
                        ? [
                            ['12:04', 'Оплата получена · 48 900 ₽'],
                            ['12:04', 'Задача поставлена Ильясу'],
                            ['Вчера', 'Заказ №1042 принят'],
                          ]
                        : [
                            ['Срок', 'К годовщине, 15 сентября'],
                            ['Размер', '17,5 · подтверждён клиентом'],
                            ['Детали', 'Гравировка внутри кольца'],
                          ]
                      ).map(([time, text], i) => (
                        <div
                          key={text}
                          style={{ animationDelay: `${i * 90}ms` }}
                        >
                          <time>{time}</time>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="work-title">
                      <h3>Заказы по этапам</h3>
                      <span>Сейчас</span>
                    </div>
                    <div className="pipeline-graphic">
                      {[
                        ['В работе', 8],
                        ['На проверке', 3],
                        ['Готовы', 5],
                      ].map(([t, n]) => (
                        <div key={t}>
                          <span>{t}</span>
                          <div>
                            <i style={{ width: `${(Number(n) / 8) * 100}%` }} />
                          </div>
                          <b>{n}</b>
                        </div>
                      ))}
                    </div>
                    <button
                      className={`attention-toggle ${filter ? 'active' : ''}`}
                      onClick={() => setFilter(!filter)}
                      aria-pressed={filter}
                    >
                      <span className="status-dot" />
                      Требуют внимания <span>2</span>
                      <Icon name={filter ? 'close' : 'arrow'} size={14} />
                    </button>
                    <div className="attention-result">
                      {filter ? (
                        <>
                          <div>
                            <span>№1036 · Кольцо, золото</span>
                            <b>Срок прошёл</b>
                          </div>
                          <div>
                            <span>№1039 · Кольцо, платина</span>
                            <b>Нет оплаты</b>
                          </div>
                        </>
                      ) : (
                        <p>Откройте два заказа, которым нужна помощь.</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="work-bottomline">
                <Icon name="lock" size={13} />
                {view === 0
                  ? 'Финансы и чужие заказы скрыты'
                  : 'Доступ к данным настроен по роли'}
                <span>Демонстрационные данные</span>
              </div>
            </div>
          </div>
          <div className="results-caption" key={view}>
            <b>{VIEWS[view].result}</b>
            <span>{VIEWS[view].text}</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const APPROACH = [
  {
    name: 'Разобраться',
    you: 'Рассказываете, как работает команда.',
    we: 'Находим, где теряются данные и что приходится делать вручную.',
  },
  {
    name: 'Спроектировать',
    you: 'Смотрите схему и подтверждаете логику.',
    we: 'Собираем таблицы, связи и правила под ваш процесс на готовом ядре.',
  },
  {
    name: 'Запустить',
    you: 'Пробуете CRM вместе с командой.',
    we: 'Переносим данные, обучаем и согласуем дальнейшее развитие.',
  },
]
function Approach({ onRequest }: { onRequest: () => void }) {
  const [step, setStep] = useState(0)
  return (
    <section id="approach" className="approach-section shell">
      <Reveal>
        <div className="approach-heading">
          <div>
            <span className="small-label">НАШ ПОДХОД</span>
            <h2>
              Вы знаете бизнес.
              <br /> <em>Сборку берём на себя.</em>
            </h2>
          </div>
          <p>
            Готовое ядро сокращает путь до запуска.
            <br /> А структуру проектирует наша команда.
            <br /> <strong>Вам не нужно становиться разработчиком CRM.</strong>
          </p>
        </div>
        <div className="approach-layout">
          <div className="approach-steps">
            {APPROACH.map((s, i) => (
              <button
                key={s.name}
                aria-pressed={step === i}
                onClick={() => setStep(i)}
              >
                <span className="approach-step-number">0{i + 1}</span>
                <div>
                  <h3>{s.name}</h3>
                  {step === i && (
                    <div className="approach-explanation">
                      <div>
                        <span>ВЫ</span>
                        <p>{s.you}</p>
                      </div>
                      <div>
                        <span>LAMBDA</span>
                        <p>{s.we}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Icon name={step === i ? 'check' : 'plus'} size={17} />
              </button>
            ))}
          </div>
          <div className="process-paper">
            <div className="paper-meta">
              <span>LAMBDA / РАБОЧИЙ ДОКУМЕНТ</span>
              <span>0{step + 1} — 03</span>
            </div>
            <div className="paper-content" key={step}>
              {step === 0 ? (
                <>
                  <span className="paper-tag">ИЗ РАЗБОРА ПРОЦЕССА</span>
                  <h3>
                    Как заказ доходит
                    <br /> до клиента.
                  </h3>
                  <div className="paper-notes">
                    <p>
                      <span>01</span> Заказ и оплата — у менеджера.
                    </p>
                    <p>
                      <span>02</span> Мастеру пишут в отдельный чат.
                    </p>
                    <p>
                      <span>03</span> Остаток меняют в таблице.
                    </p>
                  </div>
                  <div className="paper-margin-note">
                    Здесь процесс держится на человеке.
                    <br /> <b>Связываем эти шаги.</b>
                  </div>
                </>
              ) : step === 1 ? (
                <>
                  <span className="paper-tag">СХЕМА ПОД БИЗНЕС</span>
                  <h3>
                    Теперь каждый шаг
                    <br /> знает следующий.
                  </h3>
                  <div className="paper-schema">
                    <div>
                      Клиенты <small>имя · история</small>
                    </div>
                    <Icon name="arrow" />
                    <div>
                      Заказы <small>клиент · сумма</small>
                    </div>
                    <Icon name="arrow" />
                    <div>
                      Задачи <small>мастер · срок</small>
                    </div>
                  </div>
                  <div className="paper-rule">
                    <Icon name="bolt" size={16} /> Оплата → задача → уведомление
                  </div>
                </>
              ) : (
                <>
                  <span className="paper-tag">ГОТОВНОСТЬ К ЗАПУСКУ</span>
                  <h3>
                    Система с вашими
                    <br /> данными и правилами.
                  </h3>
                  <div className="paper-checks">
                    {[
                      'Данные перенесены и проверены',
                      'Правила проверены на примере заказа',
                      'Каждому настроен доступ',
                      'Команда знает, как работать',
                    ].map((t, i) => (
                      <div key={t} style={{ animationDelay: `${i * 130}ms` }}>
                        <Icon name="check" size={15} />
                        {t}
                      </div>
                    ))}
                  </div>
                  <span className="paper-sign">Можно начинать.</span>
                </>
              )}
            </div>
            <div className="paper-footer">
              <span>Структура под процесс, а не наоборот.</span>
              <Mark />
            </div>
          </div>
        </div>
        <div className="approach-end">
          <p>
            Начнём с одного процесса.
            <br /> <span>Срок и стоимость назовём после разбора.</span>
          </p>
          <button className="button button-dark" onClick={onRequest}>
            Разобрать мой процесс <Icon name="arrow" />
          </button>
        </div>
      </Reveal>
    </section>
  )
}

const QUESTIONS = [
  [
    'А если процессы поменяются?',
    'Новые таблицы, правила и отчёты добавляются к существующей структуре. Объём изменений и условия поддержки согласуем отдельно.',
  ],
  [
    'Кому Lambda не подойдёт?',
    'Если вам достаточно стандартной воронки «лид — звонок — сделка» или CRM нужна сегодня, готовое решение будет проще. Наш подход нужен там, где работа уже сложилась и требует своей структуры.',
  ],
]
function Closing({ onRequest }: { onRequest: () => void }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <section className="living-faq shell" id="faq">
        <h3>Перед первым разговором.</h3>
        <div>
          {QUESTIONS.map(([q, a], i) => (
            <div key={q}>
              <button
                aria-expanded={open === i}
                aria-controls={`question-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{q}</span>
                <Icon name={open === i ? 'close' : 'plus'} size={16} />
              </button>
              <p id={`question-${i}`} hidden={open !== i}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="living-close">
        <div className="shell">
          <div>
            <span className="small-label">30 МИНУТ НА ВАШ ПРОЦЕСС</span>
            <h2>
              Покажите, как вы работаете.
              <br /> <em>Покажем, какой будет ваша CRM.</em>
            </h2>
          </div>
          <div>
            <button className="button button-dark" onClick={onRequest}>
              Разобрать мой процесс <Icon name="arrow" />
            </button>
            <span>Без обязательств. Ничего готовить не нужно.</span>
          </div>
        </div>
      </section>
      <footer className="living-footer shell">
        <a className="brand" href="#top">
          <Mark />
          lmbd.crm
        </a>
        <span>Система должна повторять бизнес.</span>
        <small>© 2026 Lambda CRM</small>
      </footer>
    </>
  )
}

export default function LivingLanding() {
  const [request, setRequest] = useState(false)
  const requestRef = useRef(() => setRequest(true))
  return (
    <div className="living">
      <a className="skip-link" href="#how">
        Перейти к возможностям
      </a>
      <LiveHeader onRequest={requestRef.current} />
      <main>
        <Hero onRequest={requestRef.current} />
        <ConnectedBusiness />
        <Results />
        <Approach onRequest={requestRef.current} />
        <Closing onRequest={requestRef.current} />
      </main>
      {request && <RequestDialog onClose={() => setRequest(false)} />}
    </div>
  )
}
