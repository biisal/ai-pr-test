import { X, BarChart3, Sun, Globe, Moon, Thermometer, Ruler } from 'lucide-react'
import { planets } from '../data/planets'

export function StatsDashboard({ onClose }: { onClose: () => void }) {
  const planetsWithData = planets.filter(p => p.id !== 'sun')
  const largestPlanet = planetsWithData.reduce((max, p) => parseFloat(p.diameter) > parseFloat(max.diameter) ? p : max)
  const smallestPlanet = planetsWithData.reduce((min, p) => parseFloat(p.diameter) < parseFloat(min.diameter) ? p : min)
  const hottestPlanet = planetsWithData.reduce((hot, p) => {
    const tempMatch = p.surfaceTemp.match(/(\d+)/)
    const hotMatch = hot.surfaceTemp.match(/(\d+)/)
    if (!tempMatch) return hot
    if (!hotMatch) return p
    return parseInt(tempMatch[1]) > parseInt(hotMatch[1]) ? p : hot
  })
  const coldestPlanet = planetsWithData.reduce((cold, p) => {
    const tempMatch = p.surfaceTemp.match(/-?(\d+)/)
    const coldMatch = cold.surfaceTemp.match(/-?(\d+)/)
    if (!tempMatch) return cold
    if (!coldMatch) return p
    return parseInt(tempMatch[1]) < parseInt(coldMatch[1]) ? p : cold
  })
  const heaviestPlanet = planetsWithData.reduce((max, p) => {
    const massMatch = p.mass.match(/(\d+\.?\d*)\s*×\s*10/)
    const maxMatch = max.mass.match(/(\d+\.?\d*)\s*×\s*10/)
    if (!massMatch) return max
    if (!maxMatch) return p
    return parseFloat(massMatch[1]) > parseFloat(maxMatch[1]) ? p : max
  })

  const totalMoons = planetsWithData.reduce((sum, p) => sum + p.moons, 0)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal stats-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <BarChart3 size={20} />
            <h2 className="modal-title">Solar System Statistics</h2>
          </div>
          <button className="pip-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Sun size={20} /></div>
              <div className="stat-value">8</div>
              <div className="stat-label">Planets</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Moon size={20} /></div>
              <div className="stat-value">{totalMoons}</div>
              <div className="stat-label">Known Moons</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Globe size={20} /></div>
              <div className="stat-value">5</div>
              <div className="stat-label">Dwarf Planets</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-label-small">Largest</div>
              <div className="stat-value">{largestPlanet.name}</div>
              <div className="stat-label">{largestPlanet.diameter}</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-label-small">Smallest</div>
              <div className="stat-value">{smallestPlanet.name}</div>
              <div className="stat-label">{smallestPlanet.diameter}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Thermometer size={20} /></div>
              <div className="stat-value">Hottest</div>
              <div className="stat-label">{hottestPlanet.name} — {hottestPlanet.surfaceTemp}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Thermometer size={20} style={{ color: '#7ec8e3' }} /></div>
              <div className="stat-value">Coldest</div>
              <div className="stat-label">{coldestPlanet.name} — {coldestPlanet.surfaceTemp}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Ruler size={20} /></div>
              <div className="stat-value">Heaviest</div>
              <div className="stat-label">{heaviestPlanet.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}