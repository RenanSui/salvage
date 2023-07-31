import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './styles/index.css'
import { Pattern } from './components/ui/pattern'
import TitleBar from './components/ui/title-bar'
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
    {/* <TailwindIndicator /> */}
  </React.StrictMode>,
)
