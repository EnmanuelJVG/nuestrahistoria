import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { story } from './src/data/story.js'

// Copia título, descripción y enlace de story.js al <head> de index.html
// (así la vista previa al compartir el enlace también se edita en un solo sitio).
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const metaFromStory = () => ({
  name: 'meta-from-story',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      const { title, description, url } = story.site
      const base = (url || '').replace(/\/$/, '')
      const v = { TITLE: title, DESCRIPTION: description, URL: base, IMAGE: `${base}/images/compartir.jpg` }
      return html.replace(/%SITE_(\w+)%/g, (_, k) => esc(v[k]))
    },
  },
})

export default defineConfig({ plugins: [react(), metaFromStory()] })
