import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

class Guard extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(e) { console.error(e) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="oops">
        <p>Algo no salió como esperábamos.</p>
        <button className="btn" onClick={() => location.reload()}>Volver a intentarlo</button>
      </main>
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Guard><App /></Guard></StrictMode>
)
