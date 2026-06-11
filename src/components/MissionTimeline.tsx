import { X, Rocket, CheckCircle, XCircle } from 'lucide-react'
import { missions } from '../data/planets'

export function MissionTimeline({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal mission-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Rocket size={20} />
            <h2 className="modal-title">Space Exploration Missions</h2>
          </div>
          <button className="pip-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="timeline">
            {missions.sort((a, b) => b.year - a.year).map((mission, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot">
                  {mission.success ? (
                    <CheckCircle size={12} className="success" />
                  ) : (
                    <XCircle size={12} className="failure" />
                  )}
                </div>
                <div className="timeline-content">
                  <div className="timeline-year">{mission.year}</div>
                  <h4 className="timeline-name">{mission.name}</h4>
                  <p className="timeline-target">{mission.agency} — {mission.target}</p>
                  <p className="timeline-desc">{mission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}