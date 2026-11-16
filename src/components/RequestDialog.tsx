import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from './Ui'

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
            <h2 id="request-title">
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
