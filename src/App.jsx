
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import InputDFA from './pages/InputDFA'
import Result from './pages/Result'
import Visualization from './pages/Visualization'
import About from './pages/About'
import { useDFAMinimizer } from './hooks/useDFAMinimizer'

function App() {
  const dfaMinimizer = useDFAMinimizer()


  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dfa-theme')
    if (saved) return saved
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('dfa-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', transition: 'background 0.25s' }}>
      {/* Animated background blobs — dark mode only */}
      {isDark && (
        <div className="animated-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
      )}

      <div className="app-content">
        <Navbar theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input" element={<InputDFA dfaMinimizer={dfaMinimizer} />} />
          <Route path="/result" element={<Result result={dfaMinimizer.result} originalDFA={dfaMinimizer.originalDFA} />} />
          <Route path="/visualize" element={<Visualization result={dfaMinimizer.result} originalDFA={dfaMinimizer.originalDFA} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
