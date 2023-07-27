import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/index.css'
import { TailwindIndicator } from './components/tailwind-indicator'
import { Pattern } from './components/ui/pattern'
import TitleBar from './components/ui/title-bar'
import { Vignette } from './components/ui/vignette'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <App />
    <Pattern />
    <Vignette />
    <TailwindIndicator />
  </React.StrictMode>,
)
