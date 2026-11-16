import { CORE_STEPS } from '../data/content'
import { useStepNav } from '../lib/hooks'
import { Reveal } from '../components/Ui'
import {
  OrdersDemo,
  ClientCardDemo,
  AutomationDemo,
  RolesDemo,
  AnalyticsDemo,
  RaceDemo,
  NotificationsDemo,
} from '../components/Demos'

/** Пара половинных блоков под большим демо. */
function Pair({
  left,
  right,
}: {
  left: [string, string, React.ReactNode]
  right: [string, string, React.ReactNode]
}) {
  return (
    <div className="core__pair">
      {[left, right].map(([title, text, node], i) => (
        <div key={i}>
          <h4>{title}</h4>
          <p>{text}</p>
          <div className="core__pair-demo">{node}</div>
        </div>
      ))}
    </div>
  )
}

const LinksSvg = () => (
  <svg viewBox="0 0 420 190" width="100%" style={{ maxWidth: 420, display: 'block' }} fill="none">
    <line x1="70" y1="90" x2="200" y2="40" stroke="#CAD0D9" strokeWidth="1.5" />
    <line x1="200" y1="40" x2="340" y2="110" stroke="#CAD0D9" strokeWidth="1.5" />
    <line x1="70" y1="90" x2="340" y2="110" stroke="#CAD0D9" strokeWidth="1.5" strokeDasharray="4 4" />
    <rect x="10" y="72" width="120" height="36" rx="8" fill="#fff" stroke="#E4E7EC" />
    <text x="70" y="94" textAnchor="middle" fontFamily="Inter" fontSize="13" fontWeight="500" fill="#1C1D1F">
      Клиенты
    </text>
    <rect x="140" y="22" width="120" height="36" rx="8" fill="#fff" stroke="#1C1D1F" />
    <text x="200" y="44" textAnchor="middle" fontFamily="Inter" fontSize="13" fontWeight="500" fill="#1C1D1F">
      Заказы
    </text>
    <rect x="280" y="92" width="120" height="36" rx="8" fill="#fff" stroke="#E4E7EC" />
    <text x="340" y="114" textAnchor="middle" fontFamily="Inter" fontSize="13" fontWeight="500" fill="#1C1D1F">
      Задачи
    </text>
    <rect x="140" y="152" width="170" height="24" rx="6" fill="#1C1D1F" />
    <text x="225" y="168" textAnchor="middle" fontFamily="Inter" fontSize="12" fontWeight="500" fill="#fff">
      оплачен → задача мастеру
    </text>
  </svg>
)

const OrbitSvg = () => (
  <svg viewBox="0 0 420 210" width="100%" style={{ maxWidth: 420, display: 'block' }} fill="none">
    <circle cx="210" cy="105" r="95" stroke="#E4E7EC" />
    <circle cx="210" cy="105" r="62" stroke="#E4E7EC" />
    <circle cx="210" cy="105" r="28" fill="#fff" stroke="#E4E7EC" />
    <text x="210" y="112" textAnchor="middle" fontFamily="Inter Tight" fontSize="20" fontWeight="600" fill="#1C1D1F">
      λ
    </text>
    {[
      ['Заказы', 104, 32, 70],
      ['Остатки', 260, 22, 76],
      ['Смены', 300, 134, 64],
      ['Мастера', 62, 148, 76],
      ['Поставщики', 156, 182, 100],
    ].map(([label, x, y, w]) => (
      <g key={label as string}>
        <rect x={x as number} y={y as number} width={w as number} height="22" rx="6" fill="#EDEFF3" />
        <text
          x={(x as number) + (w as number) / 2}
          y={(y as number) + 15}
          textAnchor="middle"
          fontFamily="Inter"
          fontSize="12"
          fontWeight="500"
          fill="#1C1D1F"
        >
          {label}
        </text>
      </g>
    ))}
  </svg>
)

const GROUPS = [
  {
    lead: 'Таблицы под ваши данные, а не под шаблон.',
    rest: 'Заказы, изделия, мастера, остатки — набор таблиц и полей проектируется под процесс.',
    demo: <OrdersDemo />,
    pair: {
      left: ['Связи, а не вкладки.', 'Событие в одной таблице меняет данные в других.', <LinksSvg key="l" />] as [
        string,
        string,
        React.ReactNode,
      ],
      right: ['Любая форма данных.', 'Клиенты, заказы, поставки, смены, проекты.', <OrbitSvg key="o" />] as [
        string,
        string,
        React.ReactNode,
      ],
    },
  },
  {
    lead: 'Одна карточка — весь контекст.',
    rest: 'Контакты, история, файлы и связанные записи вместе. Следующий шаг виден любому, кто открыл карточку.',
    demo: <ClientCardDemo />,
  },
  {
    lead: 'Правила пишутся под ваш процесс.',
    rest: '«Оплачен» → задача мастеру, срок три дня, уведомление клиенту, остаток на складе.',
    demo: <AutomationDemo />,
    pair: {
      left: [
        'Одно событие — пять действий.',
        'В типовой CRM их делает человек. Здесь — система.',
        <RaceDemo key="r" />,
      ] as [string, string, React.ReactNode],
      right: [
        'Ничего не теряется.',
        'Уведомление приходит тому, кому нужно, и не раньше.',
        <NotificationsDemo key="n" />,
      ] as [string, string, React.ReactNode],
    },
  },
  {
    lead: 'Каждый видит только своё.',
    rest: 'Мастер — свои заказы, бухгалтер — финансы, руководитель — всё.',
    demo: <RolesDemo />,
  },
  {
    lead: 'Отчёт считается сам.',
    rest: 'Показатели берутся из данных CRM. Без выгрузок в Excel и «сведи к пятнице».',
    demo: <AnalyticsDemo />,
  },
]

export function Core() {
  const { active, setRef } = useStepNav(GROUPS.length)

  return (
    <section className="core section" id="core">
      <div className="frame">
        <Reveal className="head">
          <span className="pill">Ядро</span>
          <h2 className="h2" style={{ maxWidth: 896 }}>
            Шесть вещей, из которых собирается любой процесс.{' '}
            <span className="g">
              Таблицы, карточка, связи, автоматизации, права, аналитика — готовы. Структуру под ваш
              бизнес проектируем мы.
            </span>
          </h2>
        </Reveal>

        <div className="core__grid">
          <nav className="core__nav" aria-label="Разделы ядра">
            <div className="core__nav-in">
              <span className="core__nav-line" style={{ transform: `translateY(${active * 38}px)` }} aria-hidden="true" />
              {CORE_STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  className={`core__nav-item${i === active ? ' is-on' : ''}`}
                  onClick={() =>
                    document
                      .getElementById(`core-${i}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </nav>

          <div>
            {GROUPS.map((g, i) => (
              <div key={g.lead} id={`core-${i}`} ref={setRef(i) as never}>
                <Reveal className="core__group">
                  <h3 className="h3" style={{ maxWidth: 560 }}>
                    {g.lead} <span className="g">{g.rest}</span>
                  </h3>
                </Reveal>
                <div className="core__demo">{g.demo}</div>
                {g.pair && <Pair left={g.pair.left} right={g.pair.right} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
