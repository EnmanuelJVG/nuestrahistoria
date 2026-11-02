import { story } from './data/story.js'

const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false }
export const reduced = () => mq.matches

export const roman = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || String(n)

// "conocernos.jpg" -> /images/conocernos.jpg   (los enlaces https:// se respetan)
export const imgSrc = p =>
  !p ? '' : /^(https?:)?\/\//.test(p) ? p : `${import.meta.env.BASE_URL}images/${String(p).replace(/^\/?(images\/)?/, '')}`

// Un texto con [corchetes] es un marcador pendiente de completar
export const isPending = s => typeof s === 'string' && /\[[^\]]+\]/.test(s)

export function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim())
  if (!m) return null
  const d = new Date(+m[1], +m[2] - 1, +m[3])
  return d.getMonth() === +m[2] - 1 ? d : null
}
const fmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' })
export const formatDate = s => { const d = parseDate(s); return d ? fmt.format(d) : null }

const addMonths = (d, n) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1)
  r.setDate(Math.min(d.getDate(), new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()))
  return r
}
export function elapsed(from, to = new Date()) {
  if (!from || to < from) return { months: 0, days: 0, hours: 0, minutes: 0, total: 0 }
  let months = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth()
  if (addMonths(from, months) > to) months--
  const ms = to - addMonths(from, months)
  return {
    months,
    days: Math.floor(ms / 864e5),
    hours: Math.floor((ms % 864e5) / 36e5),
    minutes: Math.floor((ms % 36e5) / 6e4),
    total: Math.floor((to - from) / 864e5),
  }
}

const W = ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce']
export function timePhrase(e) {
  const t = e.months < 1
    ? (e.days < 1 ? 'unas pocas horas' : `${e.days} ${e.days === 1 ? 'día' : 'días'}`)
    : `${e.months <= 12 ? W[e.months] : e.months} ${e.months === 1 ? 'mes' : 'meses'}`
  return t[0].toUpperCase() + t.slice(1)
}

// Recuerdos ordenados por capítulo (y por el orden del archivo dentro de cada uno)
const ids = story.chapters.map(c => c.id)
export const memories = story.memories
  .map((m, key) => ({ ...m, key, chapter: ids.includes(m.chapter) ? m.chapter : ids[0] }))
  .sort((a, b) => ids.indexOf(a.chapter) - ids.indexOf(b.chapter) || a.key - b.key)
