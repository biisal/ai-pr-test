import { useState } from 'react'
import { X, Star, Moon, ExternalLink, Info, Ruler, Thermometer, Wind, Weight, Clock } from 'lucide-react'
import { PlanetData } from '../data/planets'

interface PlanetInfoProps {
  planet: PlanetData
  isBookmarked: boolean
  onToggleBookmark: () => void
  onClose: () => void
}

export function PlanetInfo({ planet, isBookmarked, onToggleBookmark, onClose }: PlanetInfoProps) {
  const [showMoreFacts, setShowMoreFacts] = useState(false)

  if (!planet) return null

  const specs = [
    { icon: <Ruler size={14} />, label: 'Diameter', value: planet.diameter },
    { icon: <Weight size={14} />, label: 'Mass', value: planet.mass },
    { icon: <Wind size={14} />, label: 'Gravity', value: planet.gravity },
    { icon: <Thermometer size={14} />, label: 'Surface Temp', value: planet.surfaceTemp },
    { icon: <Clock size={14} />, label: 'Orbital Period', value: planet.orbitalPeriod },
    { icon: <Clock size={14} />, label: 'Rotation Period', value: planet.rotationPeriod },
    { icon: <Moon size={14} />, label: 'Moons', value: `${planet.moons}` }
  ]

  return (
    <div className="planet-info-panel">
      <div className="pip-header">
        <div className="pip-title-group">
          <div className="pip-icon" style={{ background: planet.color, boxShadow: planet.emissive ? `0 0 20px ${planet.color}` : 'none' }}>
            <div className="pip-icon-inner" />
          </div>
          <div>
            <h2 className="pip-name">{planet.name}</h2>
            <p className="pip-type">{planet.type}</p>
          </div>
        </div>
        <div className="pip-actions">
          <button
            className={`pip-btn ${isBookmarked ? 'active' : ''}`}
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Star size={16} fill={isBookmarked ? '#ffdd44' : 'none'} />
          </button>
          <button className="pip-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="pip-body">
        <div className="pip-specs">
          {specs.map((spec) => (
            <div key={spec.label} className="pip-spec-item">
              <span className="pip-spec-icon">{spec.icon}</span>
              <div className="pip-spec-text">
                <span className="pip-spec-label">{spec.label}</span>
                <span className="pip-spec-value">{spec.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pip-atmosphere">
          <h4 className="pip-section-title">
            <Wind size={14} /> Atmosphere
          </h4>
          <p className="pip-section-text">{planet.atmosphere}</p>
        </div>

        <div className="pip-facts">
          <div className="pip-facts-header">
            <h4 className="pip-section-title">
              <Info size={14} /> Fun Facts
            </h4>
            <button
              className="pip-facts-toggle"
              onClick={() => setShowMoreFacts(!showMoreFacts)}
            >
              {showMoreFacts ? 'Show less' : `Show all (${planet.funFacts.length})`}
            </button>
          </div>
          {showMoreFacts ? (
            <ul className="pip-facts-list">
              {planet.funFacts.map((fact, i) => (
                <li key={i} className="pip-fact-item">{fact}</li>
              ))}
            </ul>
          ) : (
            <p className="pip-section-text">{planet.funFacts[0]}</p>
          )}
        </div>

        <div className="pip-discovery">
          <h4 className="pip-section-title">
            <ExternalLink size={14} /> Discovery
          </h4>
          <p className="pip-section-text">{planet.discovery}</p>
        </div>
      </div>
    </div>
  )
}