import { Fragment } from 'react'
import { story } from '../data/story.js'
import { T, Photo } from './ui.jsx'

export default function Welcome({ onBegin }) {
  const { welcome, names } = story
  const words = String(welcome.title || '').split(' ')
  return (
    <header className={`welcome${welcome.photo ? ' has-photo' : ''}`} id="inicio">
      <span className="glow glow--a" aria-hidden="true" />
      <span className="glow glow--b" aria-hidden="true" />
      <span className="welcome__frame" aria-hidden="true" />
      <div className="welcome__inner">
        <p className="welcome__to"><T>{`Para ${names.her}`}</T></p>
        {welcome.photo && (
          <div className="arch welcome__arch"><Photo src={welcome.photo} alt="Nosotros dos" eager /></div>
        )}
        <h1 className="welcome__title">
          {words.map((w, i) => <Fragment key={i}><span style={{ '--i': i }}>{w}</span>{' '}</Fragment>)}
        </h1>
        <p className="welcome__sub"><T>{welcome.subtitle}</T></p>
        <button className="btn welcome__btn" onClick={onBegin}>{welcome.button}</button>
      </div>
    </header>
  )
}
