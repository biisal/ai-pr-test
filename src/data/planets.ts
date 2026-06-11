import { MissionData, TourStop } from '../types'

export interface PlanetData {
  id: string
  name: string
  type: string
  diameter: string
  mass: string
  gravity: string
  surfaceTemp: string
  distanceFromSun: string
  orbitalPeriod: string
  rotationPeriod: string
  moons: number
  atmosphere: string
  funFacts: string[]
  discovery: string
  color: string
  emissive?: string
  radius: number
  orbitRadius: number
  orbitalSpeed: number
  rotationSpeed: number
  tilt: number
  hasRings: boolean
  ringColor?: string
  ringSize?: number
  moonsList?: MoonData[]
}

export interface MoonData {
  name: string
  radius: number
  orbitRadius: number
  orbitalSpeed: number
  color: string
  parentId: string
}

export const planets: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'G-type main-sequence star',
    diameter: '1,391,000 km',
    mass: '1.989 × 10³⁰ kg',
    gravity: '274 m/s²',
    surfaceTemp: '5,500°C (surface)',
    distanceFromSun: '0 km',
    orbitalPeriod: '—',
    rotationPeriod: '25.4 days',
    moons: 0,
    atmosphere: 'Hydrogen (73%), Helium (25%)',
    funFacts: [
      'The Sun contains 99.86% of all mass in the Solar System.',
      'It takes about 8 minutes for light from the Sun to reach Earth.',
      'The Sun\'s core temperature reaches about 15 million °C.',
      'Solar flares can release energy equivalent to millions of hydrogen bombs.',
      'The Sun is about 4.6 billion years old — middle-aged for a star.'
    ],
    discovery: 'Known since ancient times. Recognized as the center of the Solar System by Copernicus in 1543.',
    color: '#ffaa00',
    emissive: '#ff4400',
    radius: 8,
    orbitRadius: 0,
    orbitalSpeed: 0,
    rotationSpeed: 0.002,
    tilt: 7.25,
    hasRings: false
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial planet',
    diameter: '4,879 km',
    mass: '3.301 × 10²³ kg',
    gravity: '3.7 m/s²',
    surfaceTemp: '-180°C to 430°C',
    distanceFromSun: '57.9 million km',
    orbitalPeriod: '88 days',
    rotationPeriod: '58.6 days',
    moons: 0,
    atmosphere: 'Extremely thin: Oxygen, Sodium, Hydrogen, Helium',
    funFacts: [
      'Mercury is the smallest planet in the Solar System.',
      'A year on Mercury is just 88 Earth days.',
      'Despite being closest to the Sun, it\'s not the hottest planet (Venus is).',
      'Mercury has no atmosphere to retain heat, so temperatures swing wildly.',
      'A day on Mercury lasts 59 Earth days.'
    ],
    discovery: 'Known since ancient times. First telescopic observation by Galileo in 1610.',
    color: '#b0b0b0',
    radius: 0.8,
    orbitRadius: 14,
    orbitalSpeed: 0.04,
    rotationSpeed: 0.005,
    tilt: 0.034,
    hasRings: false
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial planet',
    diameter: '12,104 km',
    mass: '4.867 × 10²⁴ kg',
    gravity: '8.87 m/s²',
    surfaceTemp: '462°C (average)',
    distanceFromSun: '108.2 million km',
    orbitalPeriod: '225 days',
    rotationPeriod: '243 days (retrograde)',
    moons: 0,
    atmosphere: 'Carbon dioxide (96.5%), Nitrogen (3.5%)',
    funFacts: [
      'Venus rotates backwards compared to most planets (retrograde rotation).',
      'It\'s the hottest planet despite not being closest to the Sun.',
      'A day on Venus is longer than its year.',
      'Venus is sometimes called Earth\'s "sister planet" due to similar size.',
      'The atmospheric pressure on Venus is 92 times that of Earth.'
    ],
    discovery: 'Known since ancient times. First spacecraft visit by Mariner 2 in 1962.',
    color: '#e8cda0',
    radius: 1.5,
    orbitRadius: 18,
    orbitalSpeed: 0.025,
    rotationSpeed: 0.002,
    tilt: 177.4,
    hasRings: false
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial planet',
    diameter: '12,756 km',
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.81 m/s²',
    surfaceTemp: '-88°C to 58°C',
    distanceFromSun: '149.6 million km',
    orbitalPeriod: '365.25 days',
    rotationPeriod: '24 hours',
    moons: 1,
    atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon (0.93%)',
    funFacts: [
      'Earth is the only known planet to harbor life.',
      'About 71% of Earth\'s surface is covered by water.',
      'Earth\'s magnetic field protects us from solar radiation.',
      'The Moon is gradually drifting away from Earth at 3.8 cm per year.',
      'Earth is the densest planet in the Solar System.'
    ],
    discovery: '—',
    color: '#4b8bbe',
    radius: 1.6,
    orbitRadius: 22,
    orbitalSpeed: 0.02,
    rotationSpeed: 0.02,
    tilt: 23.4,
    hasRings: false,
    moonsList: [
      { name: 'Luna', radius: 0.4, orbitRadius: 2.5, orbitalSpeed: 0.03, color: '#c0c0c0', parentId: 'earth' }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial planet',
    diameter: '6,792 km',
    mass: '6.417 × 10²³ kg',
    gravity: '3.72 m/s²',
    surfaceTemp: '-87°C to -5°C',
    distanceFromSun: '227.9 million km',
    orbitalPeriod: '687 days',
    rotationPeriod: '24.6 hours',
    moons: 2,
    atmosphere: 'Carbon dioxide (95%), Argon (2%), Nitrogen (2%)',
    funFacts: [
      'Mars has the tallest mountain in the Solar System: Olympus Mons (21.9 km).',
      'It also has the longest canyon: Valles Marineris (4,000 km).',
      'Mars\' thin atmosphere means liquid water cannot exist on the surface.',
      'A Mars day (sol) is just slightly longer than an Earth day.',
      'Mars has seasons like Earth due to its axial tilt.'
    ],
    discovery: 'Known since ancient times. First spacecraft visit by Mariner 4 in 1965.',
    color: '#e27b58',
    radius: 1.2,
    orbitRadius: 28,
    orbitalSpeed: 0.015,
    rotationSpeed: 0.019,
    tilt: 25.2,
    hasRings: false,
    moonsList: [
      { name: 'Phobos', radius: 0.15, orbitRadius: 1.8, orbitalSpeed: 0.05, color: '#a0a0a0', parentId: 'mars' },
      { name: 'Deimos', radius: 0.1, orbitRadius: 2.4, orbitalSpeed: 0.035, color: '#909090', parentId: 'mars' }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas giant',
    diameter: '142,984 km',
    mass: '1.898 × 10²⁷ kg',
    gravity: '24.79 m/s²',
    surfaceTemp: '-108°C (cloud top)',
    distanceFromSun: '778.5 million km',
    orbitalPeriod: '11.86 years',
    rotationPeriod: '9.93 hours',
    moons: 95,
    atmosphere: 'Hydrogen (90%), Helium (10%)',
    funFacts: [
      'Jupiter is the largest planet in the Solar System.',
      'The Great Red Spot is a storm larger than Earth that has raged for centuries.',
      'Jupiter has the strongest magnetic field of any planet.',
      'It has at least 95 known moons.',
      'Jupiter\'s rapid rotation causes it to bulge at the equator.'
    ],
    discovery: 'Known since ancient times. Its moons discovered by Galileo in 1610.',
    color: '#c88b3a',
    radius: 4.0,
    orbitRadius: 38,
    orbitalSpeed: 0.008,
    rotationSpeed: 0.04,
    tilt: 3.13,
    hasRings: true,
    ringColor: '#9a8c7a',
    ringSize: 2.5,
    moonsList: [
      { name: 'Io', radius: 0.6, orbitRadius: 3.5, orbitalSpeed: 0.04, color: '#f5d742', parentId: 'jupiter' },
      { name: 'Europa', radius: 0.5, orbitRadius: 4.5, orbitalSpeed: 0.03, color: '#c8d8e8', parentId: 'jupiter' },
      { name: 'Ganymede', radius: 0.9, orbitRadius: 6.0, orbitalSpeed: 0.025, color: '#b0a090', parentId: 'jupiter' },
      { name: 'Callisto', radius: 0.8, orbitRadius: 8.0, orbitalSpeed: 0.02, color: '#807060', parentId: 'jupiter' }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas giant',
    diameter: '120,536 km',
    mass: '5.683 × 10²⁶ kg',
    gravity: '10.44 m/s²',
    surfaceTemp: '-139°C (cloud top)',
    distanceFromSun: '1.43 billion km',
    orbitalPeriod: '29.46 years',
    rotationPeriod: '10.66 hours',
    moons: 146,
    atmosphere: 'Hydrogen (96%), Helium (3%)',
    funFacts: [
      'Saturn\'s ring system spans up to 282,000 km but is only about 10 meters thick.',
      'Saturn is so light it would float in water (density less than water).',
      'Its moon Titan has a thick atmosphere and liquid methane lakes.',
      'Saturn has at least 146 known moons.',
      'The rings are made of ice and rock particles ranging from dust to house-sized.'
    ],
    discovery: 'Known since ancient times. Rings first observed by Galileo in 1610.',
    color: '#ead6b0',
    radius: 3.5,
    orbitRadius: 48,
    orbitalSpeed: 0.006,
    rotationSpeed: 0.038,
    tilt: 26.73,
    hasRings: true,
    ringColor: '#c8b898',
    ringSize: 4.0,
    moonsList: [
      { name: 'Titan', radius: 0.8, orbitRadius: 4.5, orbitalSpeed: 0.02, color: '#e8a040', parentId: 'saturn' },
      { name: 'Rhea', radius: 0.5, orbitRadius: 5.5, orbitalSpeed: 0.025, color: '#b0b0b0', parentId: 'saturn' },
      { name: 'Iapetus', radius: 0.4, orbitRadius: 7.0, orbitalSpeed: 0.015, color: '#808080', parentId: 'saturn' }
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice giant',
    diameter: '51,118 km',
    mass: '8.681 × 10²⁵ kg',
    gravity: '8.69 m/s²',
    surfaceTemp: '-197°C',
    distanceFromSun: '2.87 billion km',
    orbitalPeriod: '84.01 years',
    rotationPeriod: '17.24 hours (retrograde)',
    moons: 27,
    atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2%)',
    funFacts: [
      'Uranus rotates on its side with an axial tilt of 98 degrees.',
      'The methane in its atmosphere gives Uranus its blue color.',
      'Uranus was the first planet discovered with a telescope.',
      'It has a ring system that is faint and difficult to observe.',
      'A year on Uranus lasts about 84 Earth years.'
    ],
    discovery: 'Discovered by William Herschel on March 13, 1781.',
    color: '#7ec8e3',
    radius: 2.2,
    orbitRadius: 60,
    orbitalSpeed: 0.004,
    rotationSpeed: 0.03,
    tilt: 97.77,
    hasRings: true,
    ringColor: '#7a9aa5',
    ringSize: 1.5,
    moonsList: [
      { name: 'Miranda', radius: 0.3, orbitRadius: 2.5, orbitalSpeed: 0.04, color: '#a0a0a0', parentId: 'uranus' },
      { name: 'Ariel', radius: 0.4, orbitRadius: 3.5, orbitalSpeed: 0.03, color: '#c0c0c0', parentId: 'uranus' },
      { name: 'Titania', radius: 0.5, orbitRadius: 4.5, orbitalSpeed: 0.025, color: '#b0b0b0', parentId: 'uranus' },
      { name: 'Oberon', radius: 0.45, orbitRadius: 5.5, orbitalSpeed: 0.02, color: '#909090', parentId: 'uranus' }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice giant',
    diameter: '49,528 km',
    mass: '1.024 × 10²⁶ kg',
    gravity: '11.15 m/s²',
    surfaceTemp: '-201°C',
    distanceFromSun: '4.50 billion km',
    orbitalPeriod: '164.8 years',
    rotationPeriod: '16.11 hours',
    moons: 16,
    atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1%)',
    funFacts: [
      'Neptune has the strongest winds in the Solar System, reaching 2,100 km/h.',
      'It was the first planet located through mathematical prediction.',
      'Neptune\'s vivid blue color is due to methane absorbing red light.',
      'It has a faint ring system composed of dark particles.',
      'Neptune has completed only one orbit since its discovery in 1846.'
    ],
    discovery: 'Predicted by Le Verrier and first observed by Galle on September 23, 1846.',
    color: '#3b5ba5',
    radius: 2.0,
    orbitRadius: 72,
    orbitalSpeed: 0.003,
    rotationSpeed: 0.032,
    tilt: 28.32,
    hasRings: false,
    moonsList: [
      { name: 'Triton', radius: 0.5, orbitRadius: 3.0, orbitalSpeed: 0.025, color: '#d0c8c0', parentId: 'neptune' }
    ]
  }
]

export const missions: MissionData[] = [
  { name: 'Sputnik 1', year: 1957, target: 'Earth orbit', agency: 'USSR', description: 'First artificial satellite.', success: true },
  { name: 'Luna 2', year: 1959, target: 'Moon', agency: 'USSR', description: 'First spacecraft to reach the Moon.', success: true },
  { name: 'Venera 3', year: 1965, target: 'Venus', agency: 'USSR', description: 'First spacecraft to impact another planet.', success: true },
  { name: 'Mariner 4', year: 1965, target: 'Mars', agency: 'NASA', description: 'First successful flyby of Mars.', success: true },
  { name: 'Apollo 11', year: 1969, target: 'Moon', agency: 'NASA', description: 'First humans to land on the Moon.', success: true },
  { name: 'Venera 7', year: 1970, target: 'Venus', agency: 'USSR', description: 'First spacecraft to soft-land on another planet.', success: true },
  { name: 'Mariner 10', year: 1974, target: 'Mercury', agency: 'NASA', description: 'First spacecraft to visit Mercury.', success: true },
  { name: 'Viking 1', year: 1976, target: 'Mars', agency: 'NASA', description: 'First successful Mars lander.', success: true },
  { name: 'Voyager 1', year: 1977, target: 'Jupiter/Saturn', agency: 'NASA', description: 'Explored Jupiter, Saturn, and entered interstellar space.', success: true },
  { name: 'Voyager 2', year: 1977, target: 'Outer planets', agency: 'NASA', description: 'Only spacecraft to visit Uranus and Neptune.', success: true },
  { name: 'Galileo', year: 1989, target: 'Jupiter', agency: 'NASA', description: 'First spacecraft to orbit Jupiter.', success: true },
  { name: 'Cassini', year: 1997, target: 'Saturn', agency: 'NASA/ESA/ASI', description: 'Studied Saturn system for 13 years.', success: true },
  { name: 'Mars Rover Spirit', year: 2004, target: 'Mars', agency: 'NASA', description: 'Explored Mars geology for 6 years.', success: true },
  { name: 'New Horizons', year: 2006, target: 'Pluto', agency: 'NASA', description: 'First spacecraft to visit Pluto.', success: true },
  { name: 'Curiosity Rover', year: 2012, target: 'Mars', agency: 'NASA', description: 'Studying Mars habitability.', success: true },
  { name: 'InSight', year: 2018, target: 'Mars', agency: 'NASA', description: 'Studied Mars interior structure.', success: true },
  { name: 'Perseverance Rover', year: 2021, target: 'Mars', agency: 'NASA', description: 'Searching for signs of ancient life.', success: true },
  { name: 'Europa Clipper', year: 2024, target: 'Europa', agency: 'NASA', description: 'Studying Jupiter\'s icy moon.', success: true }
]

export const tourStops: TourStop[] = [
  { planetId: 'sun', duration: 5, label: 'Our Star', description: 'The heart of our Solar System — a fiery ball of hydrogen and helium.' },
  { planetId: 'mercury', duration: 3, label: 'Scorched World', description: 'The smallest and fastest planet, baked by the nearby Sun.' },
  { planetId: 'venus', duration: 3, label: 'Twin Planet', description: 'Earth\'s sister planet with a runaway greenhouse effect.' },
  { planetId: 'earth', duration: 4, label: 'Pale Blue Dot', description: 'Our home — the only known world to harbor life.' },
  { planetId: 'mars', duration: 3, label: 'The Red Planet', description: 'Home to the tallest mountain and longest canyon.' },
  { planetId: 'jupiter', duration: 4, label: 'King of Planets', description: 'The largest planet with a storm larger than Earth.' },
  { planetId: 'saturn', duration: 4, label: 'Lord of the Rings', description: 'The most magnificent ring system in the Solar System.' },
  { planetId: 'uranus', duration: 3, label: 'Sideways Planet', description: 'An ice giant that rotates on its side.' },
  { planetId: 'neptune', duration: 3, label: 'The Blue Giant', description: 'The windiest world with the fastest storms.' }
]