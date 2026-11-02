import { useEffect, useState } from 'react'
import { story } from '../data/story.js'
import { parseDate, formatDate, elapsed, timePhrase } from '../lib.js'
import { T, Photo } from './ui.jsx'

export default function Together() {
  const { together, dates } = story
  const since = parseDate(dates.together)
  const met = parseDate(dates.met)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])

  const e = elapsed(since, now)
  const phrase = String(together.phrase || '').replace('{tiempo}', since ? timePhrase(e) : '[tiempo]')
  const pct = since && met && met < since ? Math.max(4, Math.min(100, ((now - since) / (now - met)) * 100)) : null
  const photos = (together.photos || []).filter(Boolean).slice(0, 3)
  const cells = [[e.months, 'mes', 'meses'], [e.days, 'día', 'días'], [e.hours, 'hora', 'horas'], [e.minutes, 'minuto', 'minutos']]

  return (
    <section id="juntos" className="together">
      <h2 className="together__phrase" data-reveal><T>{phrase}</T></h2>
      {since ? (
        <div className="counter" data-reveal>
          {cells.map(([n, one, many]) => <div key={many}><b>{n}</b><span>{n === 1 ? one : many}</span></div>)}
        </div>
      ) : (
        <p className="together__miss" data-reveal><span className="pending">[Añade la fecha en que se hicieron novios en story.js, en dates.together]</span></p>
      )}
      {pct !== null && (
        <div className="span" data-reveal style={{ '--pct': pct }}>
          <div className="span__bar"><i /></div>
          <div className="span__row">
            <p><b>Nos conocimos</b>{formatDate(dates.met)}</p>
            <p><b>Nos hicimos novios</b>{formatDate(dates.together)}</p>
          </div>
        </div>
      )}
      {photos.length > 0 && (
        <div className="collage" data-n={photos.length} data-reveal>
          {photos.map((p, i) => <Photo key={i} src={p} alt="Nosotros dos" />)}
        </div>
      )}
    </section>
  )
}
