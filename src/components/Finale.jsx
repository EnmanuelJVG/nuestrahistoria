import { story } from '../data/story.js'
import { T, Photo } from './ui.jsx'

export default function Finale({ onRestart }) {
  const f = story.finale
  const paras = String(f.message || '').split(/\n\s*\n/).filter(Boolean)
  return (
    <section id="final" className="finale">
      {f.photo && <div className="arch finale__photo" data-reveal><Photo src={f.photo} alt="Nosotros dos" /></div>}
      <h2 className="finale__title" data-reveal><T>{f.title}</T></h2>
      <div className="finale__msg" data-reveal style={{ '--d': '.15s' }}>{paras.map((p, i) => <p key={i}><T>{p}</T></p>)}</div>
      {f.signature && <p className="finale__sign" data-reveal style={{ '--d': '.3s' }}><T>{f.signature}</T></p>}
      <div data-reveal style={{ '--d': '.4s' }}><button className="btn" onClick={onRestart}>{f.button}</button></div>
    </section>
  )
}
