import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './styles/index.css'
import { TailwindIndicator } from './components/tailwind-indicator'
import TitleBar from './components/title-bar'
import { Pattern } from './components/ui/pattern'
import { Toaster } from './components/ui/toaster'
import { Vignette } from './components/ui/vignette'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TitleBar />
    <Toaster />
    <App />
    <Pattern />
    <Vignette />
    <TailwindIndicator />
  </React.StrictMode>,
)
