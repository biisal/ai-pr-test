import * as THREE from 'three'
import { planets } from '../data/planets'

export class SolarScene {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private clock: THREE.Clock
  private planetMeshes: Map<string, THREE.Mesh> = new Map()
  private moonMeshes: Map<string, THREE.Mesh> = new Map()
  private orbitLines: THREE.Line[] = []
  private labelSprites: THREE.Sprite[] = []
  private rings: THREE.Mesh[] = []
  private planetGroups: Map<string, THREE.Group> = new Map()
  private moonGroups: Map<string, THREE.Group> = new Map()
  private sunMesh!: THREE.Mesh
  private sunGlow!: THREE.Sprite
  private starField!: THREE.Points
  private asteroidBelt!: THREE.Points
  private timeSpeed: number = 1
  private showOrbits: boolean = true
  private showLabels: boolean = true
  private targetPosition: THREE.Vector3 | null = null
  private targetLookAt: THREE.Vector3 | null = null
  private isAnimatingCamera: boolean = false
  private animationProgress: number = 0
  private startPos: THREE.Vector3 = new THREE.Vector3()
  private startTarget: THREE.Vector3 = new THREE.Vector3()
  private isDragging: boolean = false
  private previousMousePosition: { x: number; y: number } = { x: 0, y: 0 }
  private currentZoom: number = 35
  private onReady: () => void
  private pressedKeys: Set<string> = new Set()
  private raycaster: THREE.Raycaster = new THREE.Raycaster()
  private mouse: THREE.Vector2 = new THREE.Vector2()
  private clickableObjects: THREE.Object3D[] = []
  private hoveredObject: string | null = null
  public onObjectClick?: (id: string) => void
  public onObjectHover?: (id: string | null) => void

  constructor(container: HTMLElement, onReady: () => void) {
    this.onReady = onReady
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 2000)
    this.camera.position.set(0, 20, 45)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    container.appendChild(this.renderer.domElement)

    this.clock = new THREE.Clock()

    this.initScene()
    this.initEventListeners(container)
    this.animate()
    this.onReady()
  }

  private initScene(): void {
    this.createSun()
    this.createPlanets()
    this.createOrbits()
    this.createStarField()
    this.createAsteroidBelt()
    this.createAmbientLight()
  }

  private createSun(): void {
    const sunGeom = new THREE.SphereGeometry(8, 64, 64)
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 })
    this.sunMesh = new THREE.Mesh(sunGeom, sunMat)
    this.scene.add(this.sunMesh)

    const glowGeom = new THREE.SphereGeometry(8.5, 32, 32)
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        color: { value: new THREE.Color(0xff6600) },
        opacity: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(color, intensity * opacity);
        }
      `
    })
    const glowMesh = new THREE.Mesh(glowGeom, glowMat)
    this.scene.add(glowMesh)

    const spriteMap = this.createGlowSprite()
    this.sunGlow = new THREE.Sprite(spriteMap)
    this.sunGlow.scale.set(30, 30, 1)
    this.sunGlow.position.set(0, 0, 0)
    this.scene.add(this.sunGlow)

    const sunLight = new THREE.PointLight(0xffffff, 2.5, 300)
    sunLight.position.set(0, 0, 0)
    sunLight.castShadow = true
    this.scene.add(sunLight)

    const ambientLight = new THREE.AmbientLight(0x222244, 0.3)
    this.scene.add(ambientLight)

    this.clickableObjects.push(this.sunMesh)
  }

  private createGlowSprite(): THREE.SpriteMaterial {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(255, 200, 50, 1)')
    gradient.addColorStop(0.2, 'rgba(255, 150, 0, 0.8)')
    gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 50, 0, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    const texture = new THREE.CanvasTexture(canvas)
    return new THREE.SpriteMaterial({ map: texture, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })
  }

  private createPlanets(): void {
    planets.filter(p => p.id !== 'sun').forEach((planet) => {
      const group = new THREE.Group()
      const geom = new THREE.SphereGeometry(planet.radius, 32, 32)
      const color = new THREE.Color(planet.color)
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.1,
        emissive: color,
        emissiveIntensity: 0.05
      })
      const mesh = new THREE.Mesh(geom, mat)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.position.x = planet.orbitRadius
      mesh.rotation.z = (planet.tilt * Math.PI) / 180
      mesh.userData = { planetId: planet.id }
      group.add(mesh)
      this.scene.add(group)

      this.planetMeshes.set(planet.id, mesh)
      this.planetGroups.set(planet.id, group)
      this.clickableObjects.push(mesh)

      if (planet.hasRings && planet.ringSize && planet.ringColor) {
        this.createRing(mesh, planet.radius, planet.ringSize, planet.ringColor)
      }

      if (planet.moonsList) {
        planet.moonsList.forEach((moon) => {
          const moonGroup = new THREE.Group()
          const moonGeom = new THREE.SphereGeometry(moon.radius, 16, 16)
          const moonMat = new THREE.MeshStandardMaterial({
            color: moon.color,
            roughness: 0.8,
            metalness: 0.1
          })
          const moonMesh = new THREE.Mesh(moonGeom, moonMat)
          moonMesh.position.x = moon.orbitRadius
          moonGroup.add(moonMesh)
          mesh.add(moonGroup)
          this.moonMeshes.set(moon.name, moonMesh)
          this.moonGroups.set(moon.name, moonGroup)
        })
      }
    })
  }

  private createRing(parent: THREE.Mesh, planetRadius: number, ringSize: number, color: string): void {
    const innerRadius = planetRadius * 1.3 + 0.5
    const outerRadius = planetRadius * 1.3 + ringSize
    const ringGeom = new THREE.RingGeometry(innerRadius, outerRadius, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    })
    const ringMesh = new THREE.Mesh(ringGeom, ringMat)
    ringMesh.position.x = 0
    ringMesh.rotation.x = Math.PI / 2.5
    parent.add(ringMesh)
    this.rings.push(ringMesh)
  }

  private createOrbits(): void {
    planets.filter(p => p.id !== 'sun').forEach((planet) => {
      const points: THREE.Vector3[] = []
      const segments = 128
      const radius = planet.orbitRadius
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: 0x444466,
        transparent: true,
        opacity: 0.4
      })
      const line = new THREE.Line(geom, mat)
      this.scene.add(line)
      this.orbitLines.push(line)
    })
  }

  private createStarField(): void {
    const count = 15000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const radius = 300 + Math.random() * 700
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
      const colorVal = 0.7 + Math.random() * 0.3
      colors[i * 3] = colorVal
      colors[i * 3 + 1] = colorVal
      colors[i * 3 + 2] = colorVal * (0.8 + Math.random() * 0.2)
      sizes[i] = 0.5 + Math.random() * 1.5
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    this.starField = new THREE.Points(geom, mat)
    this.scene.add(this.starField)
  }

  private createAsteroidBelt(): void {
    const count = 4000
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 31 + Math.random() * 5
      const height = (Math.random() - 0.5) * 1.5
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = height
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      color: 0x888877,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
    this.asteroidBelt = new THREE.Points(geom, mat)
    this.scene.add(this.asteroidBelt)
  }

  private createAmbientLight(): void {
    const hemiLight = new THREE.HemisphereLight(0x444488, 0x222244, 0.4)
    this.scene.add(hemiLight)
  }

  private initEventListeners(container: HTMLElement): void {
    container.addEventListener('wheel', (e) => {
      e.preventDefault()
      const orbitSpeed = 0.004
      const dist = this.camera.position.length()
      this.camera.position.x += e.deltaX * orbitSpeed * dist * 0.02
      this.camera.position.y -= e.deltaY * orbitSpeed * dist * 0.02
      this.camera.position.y = Math.max(-100, Math.min(100, this.camera.position.y))
      this.camera.lookAt(0, 0, 0)
    }, { passive: false })

    container.addEventListener('mousedown', (e) => {
      if (e.button === 2) return
      this.isDragging = true
      this.previousMousePosition = { x: e.clientX, y: e.clientY }
    })

    container.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / container.clientWidth) * 2 - 1
      this.mouse.y = -(e.clientY / container.clientHeight) * 2 + 1

      if (this.isDragging) {
        const dy = e.clientY - this.previousMousePosition.y
        this.currentZoom = Math.max(10, Math.min(120, this.currentZoom - dy * 0.1))
        const dir = new THREE.Vector3(0, 0, 0).sub(this.camera.position).normalize()
        this.camera.position.copy(dir.multiplyScalar(this.currentZoom))
        this.camera.lookAt(0, 0, 0)
        this.previousMousePosition = { x: e.clientX, y: e.clientY }
      }

      if (!this.isDragging) {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.clickableObjects)
        if (intersects.length > 0) {
          const obj = intersects[0].object
          const id = obj.userData.planetId || 'sun'
          if (this.hoveredObject !== id) {
            this.hoveredObject = id
            this.onObjectHover?.(id)
            container.style.cursor = 'pointer'
          }
        } else {
          if (this.hoveredObject) {
            this.hoveredObject = null
            this.onObjectHover?.(null)
            container.style.cursor = 'default'
          }
        }
      }
    })

    container.addEventListener('mouseup', () => { this.isDragging = false })
    container.addEventListener('mouseleave', () => { this.isDragging = false })

    container.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObjects(this.clickableObjects)
      if (intersects.length > 0) {
        const obj = intersects[0].object
        const id = obj.userData.planetId || 'sun'
        this.onObjectClick?.(id)
      }
    })

    let lastTouchDist = 0
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
      }
    }, { passive: true })

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.previousMousePosition.x
        const dy = e.touches[0].clientY - this.previousMousePosition.y
        const dist = this.camera.position.length()
        this.camera.position.x -= dx * 0.005 * dist * 0.03
        this.camera.position.y += dy * 0.005 * dist * 0.03
        this.camera.lookAt(0, 0, 0)
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      } else if (e.touches.length === 2) {
        const touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        const zoomDelta = (lastTouchDist - touchDist) * 0.05
        this.currentZoom = Math.max(10, Math.min(120, this.currentZoom + zoomDelta))
        const dir = new THREE.Vector3(0, 0, 0).sub(this.camera.position).normalize()
        this.camera.position.copy(dir.multiplyScalar(this.currentZoom))
        this.camera.lookAt(0, 0, 0)
        lastTouchDist = touchDist
      }
    }, { passive: true })

    container.addEventListener('touchend', () => { this.isDragging = false })

    window.addEventListener('keydown', (e) => { this.pressedKeys.add(e.key.toLowerCase()) })
    window.addEventListener('keyup', (e) => { this.pressedKeys.delete(e.key.toLowerCase()) })

    window.addEventListener('resize', () => {
      const w = container.clientWidth
      const h = container.clientHeight
      this.camera.aspect = w / h
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h)
    })
  }

  public focusOnPlanet(planetId: string): void {
    const planetData = planets.find(p => p.id === planetId)
    if (!planetData) return

    const group = this.planetGroups.get(planetId)
    if (!group && planetId !== 'sun') return

    let targetPos: THREE.Vector3
    let distance: number

    if (planetId === 'sun') {
      targetPos = new THREE.Vector3(0, 0, 0)
      distance = 25
    } else {
      targetPos = group!.position.clone()
      distance = planetData.radius * 6 + 8
    }

    this.startPos.copy(this.camera.position)
    this.startTarget.copy(new THREE.Vector3(0, 0, 0))
    this.targetPosition = targetPos.clone().add(new THREE.Vector3(0, 3, distance))
    this.targetLookAt = targetPos.clone()

    this.isAnimatingCamera = true
    this.animationProgress = 0
  }

  public resetCamera(): void {
    this.startPos.copy(this.camera.position)
    this.startTarget.copy(this.targetLookAt || new THREE.Vector3(0, 0, 0))
    this.targetPosition = new THREE.Vector3(0, 20, 45)
    this.targetLookAt = new THREE.Vector3(0, 0, 0)
    this.isAnimatingCamera = true
    this.animationProgress = 0
  }

  public setTimeSpeed(speed: number): void {
    this.timeSpeed = speed
  }

  public toggleOrbits(): void {
    this.showOrbits = !this.showOrbits
    this.orbitLines.forEach(line => { line.visible = this.showOrbits })
  }

  public toggleLabels(): void {
    this.showLabels = !this.showLabels
    this.labelSprites.forEach(sprite => { sprite.visible = this.showLabels })
  }

  public isLabelsVisible(): boolean { return this.showLabels }
  public isOrbitsVisible(): boolean { return this.showOrbits }

  public destroy(): void {
    window.removeEventListener('resize', () => {})
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate())

    const delta = this.clock.getDelta()

    this.updatePlanets(delta)
    this.updateSun(delta)
    this.updateCamera(delta)
    this.updateLabels()

    this.renderer.render(this.scene, this.camera)
  }

  private updatePlanets(delta: number): void {
    planets.filter(p => p.id !== 'sun').forEach((planet) => {
      const group = this.planetGroups.get(planet.id)
      const mesh = this.planetMeshes.get(planet.id)
      if (!group || !mesh) return

      const speedFactor = Math.max(this.timeSpeed, 0.001)
      const angle = performance.now() * 0.001 * planet.orbitalSpeed * speedFactor
      group.position.x = Math.cos(angle) * planet.orbitRadius
      group.position.z = Math.sin(angle) * planet.orbitRadius

      mesh.rotation.y += planet.rotationSpeed * speedFactor * delta * 30

      if (planet.moonsList) {
        planet.moonsList.forEach((moon) => {
          const moonGroup = this.moonGroups.get(moon.name)
          const moonMesh = this.moonMeshes.get(moon.name)
          if (!moonGroup || !moonMesh) return
          const moonAngle = performance.now() * 0.001 * moon.orbitalSpeed * speedFactor
          moonMesh.position.x = Math.cos(moonAngle) * moon.orbitRadius
          moonMesh.position.z = Math.sin(moonAngle) * moon.orbitRadius
        })
      }
    })
  }

  private updateSun(delta: number): void {
    this.sunMesh.rotation.y += 0.001 * Math.max(this.timeSpeed, 0.001) * delta * 30
    const pulse = 1 + Math.sin(performance.now() * 0.001) * 0.02
    this.sunGlow.scale.set(30 * pulse, 30 * pulse, 1)
  }

  private updateCamera(delta: number): void {
    if (this.isAnimatingCamera && this.targetPosition && this.targetLookAt) {
      this.animationProgress += delta * 1.5
      if (this.animationProgress >= 1) {
        this.animationProgress = 1
        this.isAnimatingCamera = false
      }
      const t = this.easeInOutCubic(this.animationProgress)
      this.camera.position.lerpVectors(this.startPos, this.targetPosition, t)
      this.camera.lookAt(
        this.startTarget.clone().lerp(this.targetLookAt, t)
      )
      this.currentZoom = this.camera.position.distanceTo(this.targetLookAt)
    } else {
      const keys = this.pressedKeys
      const moveSpeed = delta * this.currentZoom * 0.5
      if (keys.has('w') || keys.has('arrowup')) this.camera.position.y += moveSpeed
      if (keys.has('s') || keys.has('arrowdown')) this.camera.position.y -= moveSpeed
      if (keys.has('a') || keys.has('arrowleft')) this.camera.position.x -= moveSpeed
      if (keys.has('d') || keys.has('arrowright')) this.camera.position.x += moveSpeed

      this.camera.lookAt(0, 0, 0)
    }
  }

  private updateLabels(): void {
    this.labelSprites.forEach(sprite => {
      sprite.lookAt(this.camera.position)
    })
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }
}