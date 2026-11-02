import { useCallback, useEffect, useRef, useState } from 'react'
import { story } from './data/story.js'
import { memories, reduced, roman, imgSrc } from './lib.js'
import Welcome from './components/Welcome.jsx'
import Timeline from './components/Timeline.jsx'
import Together from './components/Together.jsx'
import Finale from './components/Finale.jsx'
import Modal from './components/Modal.jsx'

const wait = ms => new Promise(r => setTimeout(r, ms))
const scrollToId = (id, instant) => {
  const el = document.getElementById(id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: instant || reduced() ? 'auto' : 'smooth' })
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [curtain, setCurtain] = useState('') // '', in, hold, out
  const [open, setOpen] = useState(null)
  const busy = useRef(false)
  const closeModal = useCallback(() => setOpen(null), [])

  // Bloquea el scroll de fondo durante la transición y con un recuerdo abierto
  useEffect(() => { document.documentElement.classList.toggle('lock', !!curtain || open !== null) }, [curtain, open])

  // Aparición progresiva al hacer scroll
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.05 })
    document.querySelectorAll('[data-reveal]:not(.in)').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [started])

  // Mientras mira la portada, se van descargando las primeras fotos
  useEffect(() => {
    const t = setTimeout(() => memories.slice(0, 3).forEach(m => { if (m.photo) new Image().src = imgSrc(m.photo) }), 1200)
    return () => clearTimeout(t)
  }, [])

  const begin = async () => {
    if (busy.current) return
    busy.current = true
    const rail = () => document.querySelector('.rail')
    if (reduced()) {
      setStarted(true); await wait(60)
      rail()?.scrollTo({ left: 0 }); scrollToId('timeline')
    } else {
      setCurtain('in'); await wait(950)
      setStarted(true); await wait(120)
      rail()?.scrollTo({ left: 0 }); scrollToId('timeline', true)
      setCurtain('hold'); await wait(1900)
      setCurtain('out'); await wait(950)
      setCurtain('')
    }
    busy.current = false
  }

  return (
    <>
      <Welcome onBegin={begin} />
      {started && (
        <main>
          <Timeline onOpen={setOpen} onNext={() => scrollToId('juntos')} />
          <Together />
          <Finale onRestart={() => scrollToId('inicio')} />
        </main>
      )}
      <div className={`curtain ${curtain}`} aria-hidden="true">
        <p className="curtain__n">{roman(1)}</p>
        <p className="curtain__t">{story.chapters[0]?.title}</p>
      </div>
      {open !== null && <Modal index={open} onClose={closeModal} onNav={setOpen} />}
    </>
  )
}
