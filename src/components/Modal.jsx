import { useCallback, useEffect, useRef, useState } from 'react'
import { memories, formatDate, reduced } from '../lib.js'
import { T, Photo, IconClose, IconPrev, IconNext } from './ui.jsx'

function Gallery({ photos, alt }) {
  const strip = useRef(null)
  const [i, setI] = useState(0)
  const go = k => strip.current.scrollTo({ left: k * strip.current.clientWidth, behavior: reduced() ? 'auto' : 'smooth' })
  return (
    <div className="gallery">
      <div className="gallery__strip" ref={strip}
        onScroll={e => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {photos.map((p, k) => (
          <div className="gallery__slide" key={p + k}>
            <Photo src={p} alt={photos.length > 1 ? `${alt} (${k + 1} de ${photos.length})` : alt} eager={k === 0} />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="dots">
          {photos.map((_, k) => <button key={k} aria-label={`Foto ${k + 1}`} aria-current={k === i ? 'true' : undefined} onClick={() => go(k)} />)}
        </div>
      )}
    </div>
  )
}

export default function Modal({ index, onClose, onNav }) {
  const m = memories[index]
  const total = memories.length
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)
  const sheet = useRef(null)
  const closeBtn = useRef(null)
  const from = useRef(document.activeElement)
  const drag = useRef(null)

  const close = useCallback(() => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(true)
    setTimeout(onClose, reduced() ? 0 : 320)
  }, [onClose])

  useEffect(() => {
    closeBtn.current?.focus({ preventScroll: true })
    const prev = from.current
    return () => prev?.focus?.({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight' && index < total - 1) onNav(index + 1)
      else if (e.key === 'ArrowLeft' && index > 0) onNav(index - 1)
      else if (e.key === 'Tab') {
        const f = sheet.current.querySelectorAll('a[href],button:not([disabled])')
        if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, total, close, onNav])

  // Arrastrar el asa hacia abajo para cerrar (móvil)
  const down = e => { drag.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId) }
  const move = e => { if (drag.current != null) sheet.current.style.transform = `translateY(${Math.max(0, e.clientY - drag.current)}px)` }
  const up = e => {
    if (drag.current == null) return
    const dy = e.clientY - drag.current
    drag.current = null
    if (dy > 90) close(); else sheet.current.style.transform = ''
  }

  const photos = [m.photo, ...(m.photos || [])].filter(Boolean)
  const paras = String(m.story || '').split(/\n\s*\n/).filter(Boolean)
  const song = m.song || {}

  return (
    <div className={`modal${leaving ? ' is-leaving' : ''}`} onClick={e => { if (e.target === e.currentTarget) close() }}>
      <div className="sheet" ref={sheet} role="dialog" aria-modal="true" aria-labelledby="memory-title">
        <div className="sheet__grip" aria-hidden="true" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        <button className="sheet__close" ref={closeBtn} onClick={close} aria-label="Cerrar recuerdo"><IconClose /></button>
        <div className="sheet__scroll" key={index}>
          <div className="sheet__grid">
            {photos.length > 0 && <Gallery photos={photos} alt={`Fotografía: ${m.title}`} />}
            <div className="sheet__text">
              <p className="sheet__date"><T>{formatDate(m.date) || m.date || '[Fecha]'}</T></p>
              <h2 className="sheet__title" id="memory-title"><T>{m.title}</T></h2>
              <div className="sheet__story">{paras.map((p, k) => <p key={k}><T>{p}</T></p>)}</div>
              {m.detail && (
                <aside className="detail">
                  <p className="detail__k">Un detalle solo nuestro</p>
                  <p className="detail__t"><T>{m.detail}</T></p>
                </aside>
              )}
              {song.title && (
                <div className="song">
                  <span className="song__disc" aria-hidden="true" />
                  <div>
                    <p className="song__k">Nuestra canción</p>
                    <p className="song__t"><T>{song.title}</T></p>
                    {song.artist && <p className="song__a"><T>{song.artist}</T></p>}
                  </div>
                  {song.url && <a className="btn btn--ghost" href={song.url} target="_blank" rel="noopener noreferrer">Escuchar nuestro recuerdo</a>}
                </div>
              )}
            </div>
          </div>
          <nav className="sheet__nav" aria-label="Cambiar de recuerdo">
            {index > 0 ? <button className="link" onClick={() => onNav(index - 1)}><IconPrev width="16" height="16" /> Recuerdo anterior</button> : <span />}
            {index < total - 1 ? <button className="link" onClick={() => onNav(index + 1)}>Siguiente recuerdo <IconNext width="16" height="16" /></button> : <span />}
          </nav>
        </div>
      </div>
    </div>
  )
}
