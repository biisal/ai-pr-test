import { Play, Pause, FastForward, Rewind, Layers, Eye, EyeOff, Crosshair } from 'lucide-react'

interface ControlPanelProps {
  timeSpeed: number
  onTimeSpeedChange: (speed: number) => void
  showOrbits: boolean
  showLabels: boolean
  onToggleOrbits: () => void
  onToggleLabels: () => void
  onResetCamera: () => void
}

export function ControlPanel({
  timeSpeed,
  onTimeSpeedChange,
  showOrbits,
  showLabels,
  onToggleOrbits,
  onToggleLabels,
  onResetCamera
}: ControlPanelProps) {
  const speeds = [0, 0.5, 1, 2, 5, 10]

  const currentSpeedLabel = timeSpeed === 0 ? 'Paused' : `${timeSpeed}×`

  return (
    <div className="control-panel">
      <div className="control-group">
        <button
          className={`control-btn ${timeSpeed === 0 ? 'active' : ''}`}
          onClick={() => onTimeSpeedChange(timeSpeed === 0 ? 1 : 0)}
          title="Pause/Play"
        >
          {timeSpeed === 0 ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button
          className="control-btn"
          onClick={() => {
            const idx = speeds.indexOf(timeSpeed)
            if (idx > 0) onTimeSpeedChange(speeds[idx - 1])
            else onTimeSpeedChange(0.5)
          }}
          title="Slow down"
          disabled={timeSpeed <= 0}
        >
          <Rewind size={14} />
        </button>
        <span className="speed-label">{currentSpeedLabel}</span>
        <button
          className="control-btn"
          onClick={() => {
            const idx = speeds.indexOf(timeSpeed)
            if (idx < speeds.length - 1) onTimeSpeedChange(speeds[idx + 1])
            else onTimeSpeedChange(10)
          }}
          title="Speed up"
        >
          <FastForward size={14} />
        </button>
      </div>

      <div className="control-divider" />

      <div className="control-group">
        <button
          className={`control-btn ${showOrbits ? '' : 'inactive'}`}
          onClick={onToggleOrbits}
          title="Toggle orbits"
        >
          {showOrbits ? <Layers size={16} /> : <EyeOff size={16} />}
        </button>
        <button
          className={`control-btn ${showLabels ? '' : 'inactive'}`}
          onClick={onToggleLabels}
          title="Toggle labels"
        >
          {showLabels ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <div className="control-divider" />

      <button className="control-btn" onClick={onResetCamera} title="Reset view">
        <Crosshair size={16} />
      </button>
    </div>
  )
}