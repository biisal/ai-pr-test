import { useEffect, useRef, useState, useCallback } from 'react'
import { SolarScene } from './scenes/SolarScene'
import { planets, tourStops } from './data/planets'
import { LoadingScreen } from './components/LoadingScreen'
import { ControlPanel } from './components/ControlPanel'
import { PlanetInfo } from './components/PlanetInfo'
import { MissionTimeline } from './components/MissionTimeline'
import { StatsDashboard } from './components/StatsDashboard'
import {
  Search,
  Compass,
  X,
  Star,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Menu,
  Maximize2,
  Minimize2,
  BarChart3,
  Rocket,
  Sun
} from 'lucide-react'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [timeSpeed, setTimeSpeed] = useState(1)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showMissions, setShowMissions] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [tourMode, setTourMode] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [tourActive, setTourActive] = useState(false)
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('solar-bookmarks') || '[]') } catch { return [] }
  })
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SolarScene | null>(null)
  const tourIntervalRef = useRef<number | null>(null)

  const selectedPlanetData = selectedPlanet
    ? planets.find(p => p.id === selectedPlanet) || null
    : null

  const filteredPlanets = searchQuery
    ? planets.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : planets

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new SolarScene(containerRef.current, () => {
      setTimeout(() => setLoading(false), 1500)
    })

    scene.onObjectClick = (id) => {
      setSelectedPlanet(prev => prev === id ? null : id)
    }
    scene.onObjectHover = (id) => {
      setHoveredPlanet(id)
    }

    sceneRef.current = scene

    return () => {
      scene.destroy()
    }
  }, [])

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setTimeSpeed(timeSpeed)
    }
  }, [timeSpeed])

  const handleFocusPlanet = useCallback((id: string) => {
    setSelectedPlanet(id)
    sceneRef.current?.focusOnPlanet(id)
    setShowMobileMenu(false)
    setShowSearch(false)
  }, [])

  const handleResetCamera = useCallback(() => {
    setSelectedPlanet(null)
    sceneRef.current?.resetCamera()
  }, [])

  const handleToggleOrbits = useCallback(() => {
    setShowOrbits(prev => {
      const next = !prev
      sceneRef.current?.toggleOrbits()
      return next
    })
  }, [])

  const handleToggleLabels = useCallback(() => {
    setShowLabels(prev => {
      const next = !prev
      sceneRef.current?.toggleLabels()
      return next
    })
  }, [])

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id)
        ? prev.filter(b => b !== id)
        : [...prev, id]
      localStorage.setItem('solar-bookmarks', JSON.stringify(next))
      return next
    })
  }, [])

  const startTour = useCallback(() => {
    setTourMode(true)
    setTourStep(0)
    setTourActive(true)
    setSelectedPlanet(null)
  }, [])

  useEffect(() => {
    if (!tourActive || !tourMode) return

    const step = tourStops[tourStep]
    if (!step) {
      setTourActive(false)
      setTourMode(false)
      setSelectedPlanet(null)
      sceneRef.current?.resetCamera()
      return
    }

    handleFocusPlanet(step.planetId)

    tourIntervalRef.current = window.setTimeout(() => {
      if (tourStep < tourStops.length - 1) {
        setTourStep(prev => prev + 1)
      } else {
        setTourActive(false)
        setTourMode(false)
        setSelectedPlanet(null)
        sceneRef.current?.resetCamera()
      }
    }, step.duration * 1000)

    return () => {
      if (tourIntervalRef.current) clearTimeout(tourIntervalRef.current)
    }
  }, [tourActive, tourStep, tourMode, handleFocusPlanet])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }, [])

  const handleCloseInfo = useCallback(() => {
    setSelectedPlanet(null)
    sceneRef.current?.resetCamera()
  }, [])

  return (
    <div className="app">
      {loading && <LoadingScreen />}

      <div ref={containerRef} className="scene-container" />

      <header className="top-bar">
        <div className="top-bar-left">
          <div className="logo">
            <div className="logo-icon">
              <Sun size={20} />
            </div>
            <span className="logo-text">SOLARIS</span>
          </div>
        </div>
        <div className="top-bar-center">
          <nav className="desktop-nav">
            <button
              className={`nav-btn ${tourMode ? 'active' : ''}`}
              onClick={startTour}
              title="Guided Tour"
            >
              <Compass size={16} />
              <span>Tour</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => { setShowStats(true); setShowMobileMenu(false) }}
              title="Statistics"
            >
              <BarChart3 size={16} />
              <span>Stats</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => { setShowMissions(true); setShowMobileMenu(false) }}
              title="Missions"
            >
              <Rocket size={16} />
              <span>Missions</span>
            </button>
          </nav>
        </div>
        <div className="top-bar-right">
          <button className="icon-btn search-btn" onClick={() => setShowSearch(!showSearch)} title="Search planets">
            <Search size={18} />
          </button>
          <button className="icon-btn mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)} title="Menu">
            <Menu size={18} />
          </button>
          <button className="icon-btn desktop-only" onClick={toggleFullscreen} title="Fullscreen">
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="search-overlay">
          <div className="search-panel">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search planets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button className="icon-btn" onClick={() => { setShowSearch(false); setSearchQuery('') }}>
                <X size={16} />
              </button>
            </div>
            <div className="search-results">
              {filteredPlanets.map(p => (
                <button
                  key={p.id}
                  className={`search-result-item ${selectedPlanet === p.id ? 'active' : ''}`}
                  onClick={() => handleFocusPlanet(p.id)}
                >
                  <div className="search-result-color" style={{ backgroundColor: p.color }} />
                  <div className="search-result-info">
                    <span className="search-result-name">{p.name}</span>
                    <span className="search-result-type">{p.type}</span>
                  </div>
                  <button
                    className={`bookmark-btn ${bookmarks.includes(p.id) ? 'bookmarked' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(p.id) }}
                  >
                    <Star size={14} fill={bookmarks.includes(p.id) ? '#ffdd44' : 'none'} />
                  </button>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ControlPanel
        timeSpeed={timeSpeed}
        onTimeSpeedChange={setTimeSpeed}
        showOrbits={showOrbits}
        showLabels={showLabels}
        onToggleOrbits={handleToggleOrbits}
        onToggleLabels={handleToggleLabels}
        onResetCamera={handleResetCamera}
      />

      {selectedPlanetData && (
        <PlanetInfo
          planet={selectedPlanetData}
          isBookmarked={bookmarks.includes(selectedPlanetData.id)}
          onToggleBookmark={() => toggleBookmark(selectedPlanetData.id)}
          onClose={handleCloseInfo}
        />
      )}

      {tourMode && tourActive && tourStops[tourStep] && (
        <div className="tour-overlay">
          <div className="tour-card">
            <div className="tour-progress">
              {tourStops.map((_, i) => (
                <div key={i} className={`tour-dot ${i === tourStep ? 'active' : ''} ${i < tourStep ? 'completed' : ''}`} />
              ))}
            </div>
            <div className="tour-content">
              <h3 className="tour-label">{tourStops[tourStep].label}</h3>
              <p className="tour-desc">{tourStops[tourStep].description}</p>
            </div>
            <div className="tour-controls">
              <button className="tour-btn" onClick={() => setTourStep(prev => Math.max(0, prev - 1))} disabled={tourStep === 0}>
                <SkipBack size={16} />
              </button>
              <button className="tour-btn primary" onClick={() => setTourActive(!tourActive)}>
                {tourActive ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button className="tour-btn" onClick={() => {
                if (tourStep < tourStops.length - 1) setTourStep(prev => prev + 1)
              }} disabled={tourStep === tourStops.length - 1}>
                <SkipForward size={16} />
              </button>
              <button className="tour-btn close" onClick={() => { setTourMode(false); setTourActive(false); sceneRef.current?.resetCamera() }}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {bookmarks.length > 0 && !selectedPlanet && !showSearch && !tourMode && (
        <div className="bookmarks-bar">
          {bookmarks.map(id => {
            const p = planets.find(x => x.id === id)
            if (!p) return null
            return (
              <button key={id} className="bookmark-chip" onClick={() => handleFocusPlanet(id)}>
                <div className="bookmark-chip-dot" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
              </button>
            )
          })}
        </div>
      )}

      {!selectedPlanet && !showSearch && !tourMode && (
        <div className="planet-strip">
          {planets.map(p => (
            <button
              key={p.id}
              className={`planet-strip-item ${hoveredPlanet === p.id ? 'hovered' : ''}`}
              onClick={() => handleFocusPlanet(p.id)}
              title={p.name}
            >
              <div
                className="planet-strip-dot"
                style={{
                  backgroundColor: p.color,
                  width: p.id === 'sun' ? 24 : Math.max(12, p.radius * 4),
                  height: p.id === 'sun' ? 24 : Math.max(12, p.radius * 4),
                  boxShadow: p.id === 'sun' ? '0 0 16px rgba(255,170,0,0.6)' : 'none'
                }}
              />
              <span className="planet-strip-name">{p.name}</span>
            </button>
          ))}
        </div>
      )}

      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button className="icon-btn" onClick={() => setShowMobileMenu(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mobile-menu-items">
              <button className="mobile-menu-item" onClick={() => { startTour(); setShowMobileMenu(false) }}>
                <Compass size={18} /> Guided Tour
              </button>
              <button className="mobile-menu-item" onClick={() => { setShowStats(true); setShowMobileMenu(false) }}>
                <BarChart3 size={18} /> Statistics
              </button>
              <button className="mobile-menu-item" onClick={() => { setShowMissions(true); setShowMobileMenu(false) }}>
                <Rocket size={18} /> Space Missions
              </button>
              <button className="mobile-menu-item" onClick={toggleFullscreen}>
                {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />} Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}

      {showStats && <StatsDashboard onClose={() => setShowStats(false)} />}
      {showMissions && <MissionTimeline onClose={() => setShowMissions(false)} />}
    </div>
  )
}