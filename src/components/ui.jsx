import { useState } from 'react'
import { imgSrc, isPending } from '../lib.js'

// Marca visualmente los textos que aún son [marcadores]
export const T = ({ children }) => (isPending(children) ? <span className="pending">{children}</span> : <>{children}</>)

// Foto con carga elegante; si falta o falla, la página no se rompe
export function Photo({ src, alt = '', eager = false, className = '' }) {
  const [st, setSt] = useState('load')
  if (!src) return null
  return (
    <span className={`photo ${st} ${className}`}>
      <img
        src={imgSrc(src)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
        ref={el => { if (el && st === 'load' && el.complete && el.naturalWidth) setSt('ok') }}
        onLoad={() => setSt('ok')} onError={() => setSt('fail')}
      />
      {import.meta.env.DEV && st === 'fail' && <small className="photo__miss">No se encuentra «{src}» en public/images</small>}
    </span>
  )
}

const icon = d => props => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={d} /></svg>
)
export const IconClose = icon('M6 6l12 12M18 6L6 18')
export const IconPrev = icon('M14.5 5l-7 7 7 7')
export const IconNext = icon('M9.5 5l7 7-7 7')
