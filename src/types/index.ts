export interface CelestialObject {
  id: string
  name: string
  type: 'star' | 'planet' | 'dwarf-planet' | 'moon' | 'belt'
  position: { x: number; y: number; z: number }
}

export interface MissionData {
  name: string
  year: number
  target: string
  agency: string
  description: string
  success: boolean
}

export interface TourStop {
  planetId: string
  duration: number
  label: string
  description: string
}