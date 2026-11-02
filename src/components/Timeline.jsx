import { useEffect, useMemo, useRef, useState } from 'react'
import { story } from '../data/story.js'
import { memories, formatDate, roman, reduced } from '../lib.js'
import { T, Photo, IconPrev, IconNext } from './ui.jsx'

function buildItems() {
  const items = []
  story.chapters.forEach((c, ci) => {
    const list = memories.filter(m => m.chapter === c.id)
    if (!list.length) return
    items.push({ type: 'chapter', c, ci })
    list.forEach(m => items.push({ type: 'memory', m, ci }))
  })
  items.push({ type: 'end', ci: items.length ? items[items.length - 1].ci : 0 })
  return items
}

// Inclinación sutil en computadora (no se usa en el móvil)
const tilt = e => {
  if (e.pointerType !== 'mouse' || reduced()) return
  const c = e.currentTarget, r = c.getBoundingClientRect()
  c.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 7}deg`)
  c.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 7}deg`)
}
const untilt = e => { e.currentTarget.style.removeProperty('--rx'); e.currentTarget.style.removeProperty('--ry') }
const pad = n => String(n).padStart(2, '0')

export default function Timeline({ onOpen, onNext }) {
  const items = useMemo(buildItems, [])
  const total = memories.length
  const railRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    let raf = 0
    const update = () => {
      raf = 0
      const max = rail.scrollWidth - rail.clientWidth
      barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, rail.scrollLeft / max) : 0})`
      const mid = rail.scrollLeft + rail.clientWidth / 2
      let best = 0, bd = Infinity
      rail.querySelectorAll('[data-item]').forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid)
        if (d < bd) { bd = d; best = i }
      })
      setActive(best)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    rail.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      rail.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const go = i => {
    const rail = railRef.current
    const el = rail.querySelectorAll('[data-item]')[Math.max(0, Math.min(items.length - 1, i))]
    if (el) rail.scrollTo({ left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2, behavior: reduced() ? 'auto' : 'smooth' })
  }

  const memIdx = items.map((it, i) => (it.type === 'memory' ? i : -1)).filter(i => i >= 0)
  const cur = Math.min(items.slice(0, active).filter(it => it.type === 'memory').length, Math.max(0, total - 1))
  const ci = items[active]?.ci ?? 0
  const chapter = story.chapters[ci]

  return (
    <section id="timeline" className="timeline" data-tone={ci % 4} aria-label="Línea de tiempo">
      <div className="tl__head">
        <h2 className="tl__chapter" key={ci}>
          <span className="tl__roman">{roman(ci + 1)}</span> <T>{chapter?.title}</T>
        </h2>
        {total > 0 && <p className="tl__count">{pad(cur + 1)} / {pad(total)}</p>}
      </div>
      <div className="progress" aria-hidden="true"><i ref={barRef} /></div>

      <ul className="rail" ref={railRef} tabIndex={0} aria-label="Recuerdos: desliza para avanzar">
        {items.map((it, i) => {
          const common = { 'data-item': true, 'data-reveal': true, 'data-active': active === i }
          if (it.type === 'chapter') {
            return (
              <li key={i} className="slot" {...common}>
                <div className="chapter">
                  <p className="chapter__n" aria-hidden="true">{roman(it.ci + 1)}</p>
                  <h3 className="chapter__t"><T>{it.c.title}</T></h3>
                  {it.c.text && <p className="chapter__x"><T>{it.c.text}</T></p>}
                </div>
              </li>
            )
          }
          if (it.type === 'end') {
            return (
              <li key={i} className="slot" {...common}>
                <div className="chapter">
                  <h3 className="chapter__t"><T>{story.timelineEnd.text}</T></h3>
                  <button className="btn" onClick={onNext}>{story.timelineEnd.button}</button>
                </div>
              </li>
            )
          }
          const m = it.m, mi = memories.indexOf(m)
          return (
            <li key={i} className="slot" {...common}>
              <article className={`card${m.photo ? '' : ' card--text'}`} data-v={mi % 4} onPointerMove={tilt} onPointerLeave={untilt}>
                {m.photo && <div className="card__photo"><Photo src={m.photo} alt={`Fotografía: ${m.title}`} eager={mi < 2} /></div>}
                <div className="card__body">
                  <p className="card__date"><T>{formatDate(m.date) || m.date || '[Fecha]'}</T></p>
                  <h3 className="card__title">
                    <button className="card__open" onClick={() => onOpen(mi)}><T>{m.title}</T></button>
                  </h3>
                  {m.summary && <p className="card__sum"><T>{m.summary}</T></p>}
                  <span className="card__more" aria-hidden="true"><i />Abrir recuerdo</span>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      <div className="tl__foot">
        <button className="arrow" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Anterior"><IconPrev /></button>
        <ol className="dots">
          {memIdx.map((ii, k) => (
            <li key={k}><button aria-label={`Ir al recuerdo ${k + 1}`} aria-current={k === cur ? 'true' : undefined} onClick={() => go(ii)} /></li>
          ))}
        </ol>
        <button className="arrow" onClick={() => go(active + 1)} disabled={active === items.length - 1} aria-label="Siguiente"><IconNext /></button>
      </div>
      <p className="hint" data-hidden={active > 0}>Desliza para recorrer nuestra historia</p>
    </section>
  )
}
