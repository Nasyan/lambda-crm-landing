import { useEffect, useState } from 'react'
import { useScenario, reduceMotion } from '../lib/hooks'
import { useStream, useInViewRepeat } from '../lib/motion'

/* ——— Данные вымышленного клиента: ювелирный магазин OKPODOLINS ——— */

const ORDERS = [
  { n: '1042', client: 'Анна Полякова', item: 'Кольцо · золото 585', sum: '48 900', master: 'Ильяс', due: '12.09' },
  { n: '1041', client: 'Дмитрий Лебедев', item: 'Серьги · серебро', sum: '12 400', master: 'Марина', due: '10.09' },
  { n: '1040', client: 'Ольга Кузнецова', item: 'Подвеска · золото', sum: '27 300', master: 'Ильяс', due: '09.09' },
  { n: '1039', client: 'Сергей Панов', item: 'Кольцо · платина', sum: '96 000', master: '—', due: '15.09' },
  { n: '1038', client: 'Мария Орлова', item: 'Браслет · серебро', sum: '9 800', master: 'Марина', due: '05.09' },
  { n: '1037', client: 'Игорь Савин', item: 'Цепочка · золото', sum: '31 500', master: 'Артём', due: '04.09' },
]

const STATUSES = ['Ожидает оплаты', 'Оплачен', 'В работе', 'Готов', 'Выдан']

type ChipKind = 'solid' | 'fill' | 'line' | 'alert'
const Chip = ({ kind = 'fill', children }: { kind?: ChipKind; children: React.ReactNode }) => (
  <span className={`st st--${kind}`}>{children}</span>
)

const restStatus = (i: number): [ChipKind, string] => {
  const map: [ChipKind, string][] = [
    ['fill', 'В работе'],
    ['fill', 'В работе'],
    ['line', 'Ожидает оплаты'],
    ['fill', 'Готов'],
    ['alert', 'Просрочен'],
  ]
  return map[i % map.length]
}

/** Демо 1: таблица «Заказы». Сценарий — смена статуса и задача, созданная правилом. */
export function OrdersDemo() {
  const [ref, step] = useScenario<HTMLDivElement>(4, 1100)
  const open = step === 1
  const paid = step >= 2
  const task = step >= 3

  return (
    <div className="demo-wrap" ref={ref}>
      <div className="mono demo-chip">8 таблиц · 1 240 записей · 14 связей</div>
      <div className="win ui" style={{ position: 'relative' }}>
        <div className="tbl__bar">
          <div className="tbl__bar-l">
            <b>Заказы</b>
            <span className="dim">·</span>
            <span className="mute">Все заказы</span>
          </div>
          <div className="tbl__bar-r">
            <Chip kind={paid ? 'solid' : 'line'}>Статус = Оплачен</Chip>
            <Chip kind="line">Вид</Chip>
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
          const [kind, label] = first
            ? paid
              ? (['solid', 'Оплачен'] as [ChipKind, string])
              : (['line', 'Ожидает оплаты'] as [ChipKind, string])
            : restStatus(i - 1)
          return (
            <div className={`tbl__row${first && paid ? ' tbl__row--hot' : ''}`} key={o.n} style={{ position: 'relative' }}>
              <span className="mono mute">{o.n}</span>
              <span>{o.client}</span>
              <span>{o.item}</span>
              <span>{o.sum}</span>
              <span>
                <Chip kind={kind}>{label}</Chip>
              </span>
              <span>{o.master}</span>
              <span className="mute">{o.due}</span>
              {first && open && (
                <div className="drop" style={{ left: '52%', top: 30 }}>
                  {STATUSES.map((s) => (
                    <div key={s} className={s === 'Оплачен' ? 'is-on' : ''}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {task && (
          <div className="taskcard ui" style={{ top: 96 }}>
            <div className="dim" style={{ fontSize: 12 }}>
              Создано автоматически
            </div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>Изготовить кольцо · золото 585</div>
            <div className="mute" style={{ fontSize: 12, marginTop: 2 }}>
              Правило «Оплата заказа» поставило задачу и срок.
            </div>
            <div className="taskcard__rows">
              <span className="dim">Ответственный</span>
              <span>Ильяс</span>
              <span className="dim">Срок</span>
              <span>12.09 · через 3 дня</span>
              <span className="dim">Заказ</span>
              <span className="mono">№1042 ←</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Демо 2: карточка клиента. История заполняется сверху вниз, задача приходит сама. */
export function ClientCardDemo() {
  const events = [
    { time: 'сегодня 12:04', text: 'Оплата 48 900 ₽ по заказу №1042', chip: 'Оплачен' },
    { time: 'сегодня 12:04', text: 'Задача мастеру Ильясу · до 12.09', auto: true },
    { time: 'вчера', text: 'Заказ №1042 · кольцо, золото 585, размер 17,5' },
    { time: '02.09', text: 'Звонок · 4 мин · «хочет к годовщине, 15.09»' },
    { time: 'май 2025', text: 'Заказ №871 · серьги · выдан' },
  ]
  const [ref, step] = useScenario<HTMLDivElement>(events.length + 1, 550)

  return (
    <div className="demo-wrap" ref={ref}>
      <div className="win ui card3">
        <div className="card3__side">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="avatar" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Анна Полякова</div>
              <div className="dim" style={{ fontSize: 12 }}>
                клиент с мая 2025
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <Chip kind="solid">Написать</Chip>
            <Chip kind="line">Позвонить</Chip>
          </div>
          <div className="kv" style={{ marginTop: 18 }}>
            <span className="dim">Телефон</span>
            <span>+375 29 ··· ·· 41</span>
            <span className="dim">Telegram</span>
            <span>@anna_p</span>
            <span className="dim">Размер</span>
            <span>17,5</span>
            <span className="dim">Источник</span>
            <span>Instagram</span>
            <span className="dim">Теги</span>
            <span>
              <Chip kind="fill">постоянный</Chip>
            </span>
          </div>
        </div>

        <div className="card3__mid">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>История</div>
          {events.map((e, i) => (
            <div
              key={e.text}
              className={`tl__row${e.auto ? ' tl__row--auto' : ''}${step > i ? ' is-in' : ''}`}
            >
              <span className="dim">{e.time}</span>
              <span>
                {e.text}
                {e.chip && (
                  <>
                    {' '}
                    <Chip kind="solid">{e.chip}</Chip>
                  </>
                )}
                {e.auto && <span className="dim"> · создана правилом</span>}
              </span>
            </div>
          ))}
        </div>

        <div className="card3__rel">
          <div style={{ fontWeight: 600, marginBottom: 12 }}>Связано</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="relcard">
              <div className="dim">Заказы · 3</div>
              <div>№1042 · №871 · №640</div>
            </div>
            <div className={`relcard${step > 2 ? ' relcard--new' : ''}`}>
              <div className="dim">Задачи · {step > 2 ? 1 : 0}</div>
              <div>{step > 2 ? 'Изготовить кольцо · Ильяс' : '—'}</div>
            </div>
            <div className="relcard">
              <div className="dim">Файлы · 2</div>
              <div>эскиз.pdf · размер.jpg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Arrow = ({ on }: { on: boolean }) => (
  <svg className="arrow" viewBox="0 0 28 12" fill="none" aria-hidden="true">
    <line x1="0" y1="6" x2="24" y2="6" stroke={on ? '#1C1D1F' : '#D3D8DF'} strokeWidth="1.5" />
    <path d="M20 1 L26 6 L20 11" stroke={on ? '#1C1D1F' : '#D3D8DF'} strokeWidth="1.5" fill="none" />
  </svg>
)

/** Демо 3: конструктор правил. Четвёртое действие переезжает в цепочку. */
export function AutomationDemo() {
  const [ref, step] = useScenario<HTMLDivElement>(6, 800)
  const done = (n: number) => step > n

  return (
    <div className="demo-wrap demo-wrap--dots" ref={ref}>
      <div className="ui flow">
        <div className={`node${done(0) ? ' node--on' : ''}`}>
          <div className="node__top">
            <Chip kind="fill">Триггер</Chip>
            {done(0) && <Chip kind="solid">сработало</Chip>}
          </div>
          <div className="node__title">Статус заказа → Оплачен</div>
          <div className="dim" style={{ fontSize: 12 }}>
            таблица «Заказы»
          </div>
        </div>
        <Arrow on={done(1)} />
        <div className={`node${done(1) ? ' node--on' : ''}`}>
          <div className="node__top">
            <Chip kind="fill">Действие</Chip>
            {done(1) && <Chip kind="solid">готово</Chip>}
          </div>
          <div className="node__title">Создать задачу мастеру</div>
          <div className="dim" style={{ fontSize: 12 }}>
            мастер из заказа
          </div>
        </div>
        <Arrow on={done(2)} />
        <div className={`node${done(2) ? ' node--on' : ''}`}>
          <div className="node__top">
            <Chip kind="fill">Действие</Chip>
            {done(2) && <Chip kind="solid">готово</Chip>}
          </div>
          <div className="node__title">Срок +3 дня</div>
          <div className="dim" style={{ fontSize: 12 }}>
            рабочих дней
          </div>
        </div>
        <Arrow on={done(3)} />
        <div className={`node${done(3) ? ' node--on' : ''}`}>
          <div className="node__top">
            <Chip kind="fill">Действие</Chip>
            {done(3) && <Chip kind="solid">готово</Chip>}
          </div>
          <div className="node__title">Уведомить клиента</div>
          <div className="dim" style={{ fontSize: 12 }}>
            Telegram · «заказ принят»
          </div>
        </div>
        <Arrow on={step >= 4} />
        <div className={`node${step >= 4 ? ' node--drop' : ' node--ghost'}`}>
          <div className="node__top">
            <Chip kind="fill">Действие</Chip>
            {step >= 4 ? <Chip kind="solid">добавлено</Chip> : <span className="dim">перетащите</span>}
          </div>
          <div className="node__title">Списать остаток</div>
          <div className="dim" style={{ fontSize: 12 }}>
            таблица «Остатки»
          </div>
        </div>
      </div>

      <div className="palette ui">
        <div className="dim" style={{ fontSize: 12 }}>
          Добавить действие
        </div>
        <div>Поставить задачу</div>
        <div>Изменить поле</div>
        <div className={step >= 4 ? 'is-taken' : ''}>Списать остаток</div>
        <div>Отправить письмо</div>
      </div>

      <div className="mono demo-log" style={{ opacity: step >= 5 ? 1 : 0 }}>
        12:04 · правило сработало · заказ №1042 · 4 действия · 0,3 с
      </div>
    </div>
  )
}

/** Гонка: пять действий руками против одного правила. */
export function RaceDemo() {
  const rows = [
    'Обновить статус в таблице',
    'Написать мастеру в чат',
    'Поставить срок в календарь',
    'Отправить письмо клиенту',
    'Завести задачу на контроль',
  ]
  const [ref, step] = useScenario<HTMLDivElement>(7, 700)

  return (
    <div className="race ui" ref={ref}>
      <div className="race__col">
        <div className="race__head">
          <span>Типовая CRM + 4 сервиса</span>
          <span className="mono">{step >= 5 ? '4:10' : '…'}</span>
        </div>
        <ul className="race__list">
          {rows.map((r, i) => (
            <li key={r} className={step > i ? 'is-done' : ''}>
              {r}
            </li>
          ))}
        </ul>
        <div className="mono dim" style={{ marginTop: 10 }}>
          и так — каждый заказ
        </div>
      </div>
      <div className="race__col race__col--fast">
        <div className="race__head">
          <span>Lambda CRM</span>
          <span className="mono">{step >= 1 ? '0:04' : '…'}</span>
        </div>
        <div style={{ marginTop: 8, fontWeight: 600 }}>Автоматизация «Оплата заказа»</div>
        <div className="race__chips" style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 400ms' }}>
          <Chip kind="solid">статус: в работе</Chip>
          <Chip kind="solid">задача мастеру · 3 дня</Chip>
          <Chip kind="solid">клиенту: «заказ принят»</Chip>
          <Chip kind="solid">контроль: 12.09</Chip>
        </div>
        <div className="mono dim" style={{ marginTop: 10 }}>
          и так — само
        </div>
      </div>
    </div>
  )
}

/** Тикер уведомлений. */
export function NotificationsDemo() {
  const items = [
    ['Ильяс · новая задача', 'кольцо · золото 585 · до 12.09', '12:04'],
    ['Анна · «заказ принят»', 'Telegram · доставлено', '12:04'],
    ['Склад · остаток ниже минимума', 'кольцо 585 · осталось 2', '11:50'],
    ['Марина · заказ готов', '№1038 · браслет · серебро', '11:12'],
    ['Артём · срок завтра', '№1036 · кольцо · золото', '10:40'],
  ]
  const track = [...items, ...items]
  return (
    <div className="roller ui">
      <div className="roller__track" style={reduceMotion() ? { animation: 'none' } : undefined}>
        {track.map(([title, meta, time], i) => (
          <div className="notif" key={i}>
            <i />
            <div>
              <div style={{ fontWeight: 600 }}>{title}</div>
              <div className="dim">{meta}</div>
            </div>
            <span className="dim" style={{ marginLeft: 'auto' }}>
              {time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Демо 4: матрица ролей и экран мастера. */
export function RolesDemo() {
  const [ref, step] = useScenario<HTMLDivElement>(3, 1200)
  const roles = [
    ['Менеджер', 1, 0, 1, 1],
    ['Мастер', 0, 0, 1, 2],
    ['Бухгалтер', 0, 1, 0, 0],
    ['Руководитель', 1, 1, 1, 1],
  ] as const

  return (
    <div className="demo-split" ref={ref}>
      <div className="win ui" style={{ padding: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>Роли и права</div>
        <div className="roles">
          <div className="roles__h" />
          <div className="roles__h">Клиенты</div>
          <div className="roles__h">Финансы</div>
          <div className="roles__h">Склад</div>
          <div className="roles__h">Задачи</div>
          {roles.map(([name, ...cells]) => (
            <Row key={name as string} name={name as string} cells={cells as number[]} on={name === 'Мастер' && step >= 1} />
          ))}
        </div>
      </div>
      <div className="win ui" style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <b>Что видит мастер Ильяс</b>
          <Chip kind="fill">роль: мастер</Chip>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '58px 1fr 1fr 88px', fontSize: 12 }}>
          <span className="dim">№</span>
          <span className="dim">Изделие</span>
          <span className="dim">Срок</span>
          <span className={`dim hidecol${step >= 2 ? ' is-hidden' : ''}`}>Сумма</span>
          {[
            ['1042', 'Кольцо · золото 585', '12.09', '48 900'],
            ['1040', 'Подвеска · золото', '09.09', '27 300'],
            ['1029', 'Подвеска · серебро', '11.09', '8 400'],
            ['1025', 'Кольцо · платина', '20.09', '112 000'],
          ].map((r) => (
            <Cells key={r[0]} row={r} hidden={step >= 2} />
          ))}
        </div>
        <div className="dim" style={{ marginTop: 12, fontSize: 12 }}>
          Колонка «Сумма» скрыта правами роли.
        </div>
      </div>
    </div>
  )
}

function Row({ name, cells, on }: { name: string; cells: number[]; on: boolean }) {
  return (
    <>
      <div className={`roles__name${on ? ' roles__row--on' : ''}`}>{name}</div>
      {cells.map((v, i) => (
        <div key={i} className={on ? 'roles__row--on' : ''}>
          {v === 2 ? <span style={{ fontSize: 11 }}>свои</span> : <span className={`dot${v ? '' : ' dot--off'}`} />}
        </div>
      ))}
    </>
  )
}

function Cells({ row, hidden }: { row: string[]; hidden: boolean }) {
  return (
    <>
      <span className="mono" style={{ padding: '8px 0', borderTop: '1px solid var(--hair-weak)' }}>
        {row[0]}
      </span>
      <span style={{ padding: '8px 0', borderTop: '1px solid var(--hair-weak)' }}>{row[1]}</span>
      <span style={{ padding: '8px 0', borderTop: '1px solid var(--hair-weak)' }}>{row[2]}</span>
      <span
        className={`hidecol${hidden ? ' is-hidden' : ''}`}
        style={{ padding: '8px 0', borderTop: '1px solid var(--hair-weak)' }}
      >
        {row[3]}
      </span>
    </>
  )
}

/** Демо 5: аналитика — график, столбики и ответ на вопрос. */
const ANSWER =
  'Из 23 заказов августа Ильяс сдал в срок 21 — это 91 %, медиана 2,4 дня. Опоздали два: №1017 на день и №1006 на три.'

export function AnalyticsDemo() {
  const [ref, shown] = useInViewRepeat<HTMLDivElement>(0.3)
  const [typed, setTyped] = useState(false)
  const answer = useStream(ANSWER, shown && typed)

  useEffect(() => {
    if (!shown) {
      setTyped(false)
      return
    }
    if (reduceMotion()) {
      setTyped(true)
      return
    }
    const id = window.setTimeout(() => setTyped(true), 700)
    return () => window.clearTimeout(id)
  }, [shown])

  const cols = [
    [40, 30, 10],
    [45, 35, 8],
    [38, 42, 6],
    [48, 40, 4],
    [50, 44, 2],
  ]

  return (
    <div className="demo-split demo-split--wide" ref={ref}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="win ui" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>Выручка по месяцам</b>
            <span className="dim">2026</span>
          </div>
          <svg viewBox="0 0 520 120" preserveAspectRatio="none" style={{ width: '100%', height: 120, marginTop: 12, display: 'block' }}>
            <line x1="0" y1="100" x2="520" y2="100" stroke="#EDEFF3" />
            <line x1="0" y1="60" x2="520" y2="60" stroke="#EDEFF3" />
            <line x1="0" y1="20" x2="520" y2="20" stroke="#EDEFF3" />
            <path
              className={`line-draw${shown ? ' is-in' : ''}`}
              d="M0 92 C 60 88, 90 80, 130 78 S 210 70, 260 62 S 340 48, 390 40 S 470 24, 520 18"
              fill="none"
              stroke="#1C1D1F"
              strokeWidth="2"
            />
          </svg>
          <div className="dim" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            {['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="win ui" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <b>Заказы по статусам</b>
            <span className="legend">
              <span>
                <i style={{ background: '#1C1D1F' }} />в работе
              </span>
              <span>
                <i style={{ background: '#8F99A8' }} />готово
              </span>
              <span>
                <i style={{ background: '#D3D8DF' }} />просрочено
              </span>
            </span>
          </div>
          <div className="bars">
            {cols.map((c, i) => (
              <div
                className={`bars__col${shown ? ' is-in' : ''}`}
                key={i}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
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
      </div>

      <div className="win ui" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="ask">Сколько заказов Ильяс сдал в срок в августе?</div>
        <div className="dim" style={{ fontSize: 12 }}>
          {typed ? '2 источника · таблицы «Заказы», «Задачи» · 148 строк · 0,8 с' : 'считаю…'}
        </div>
        <div className="answer" style={{ opacity: typed ? 1 : 0, transition: 'opacity 400ms' }}>
          <div className="answer__num">21 из 23</div>
          <div className="dim" style={{ marginTop: 6, fontSize: 12, lineHeight: '18px', minHeight: 54 }}>
            {answer}
            {answer !== ANSWER && <span className="caret caret--block" aria-hidden="true" />}
          </div>
        </div>
        <div className="dim" style={{ fontSize: 12 }}>
          Ответ собран из данных, а не из отчёта менеджера.
        </div>
      </div>
    </div>
  )
}
