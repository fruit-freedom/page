import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Spherical, Vector3 } from 'three'

// Point the camera orbits around (slightly above ground, over the field center).
const TARGET = new Vector3(0, 0.5, 0)
const MIN_POLAR = 0.15 // don't look straight down
const MAX_POLAR = Math.PI / 2 - 0.05 // don't dip below the horizon
const MIN_RADIUS = 4
const MAX_RADIUS = 20
const ROTATE_SPEED = 0.005
const ZOOM_SPEED = 0.01

// Manual orbit controls (drag to rotate, wheel to zoom) — avoids pulling in
// @react-three/drei just for OrbitControls.
function CameraControls() {
  const { camera, gl } = useThree()
  const spherical = useRef(new Spherical())
  const dragging = useRef(false)
  const prev = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    // Seed spherical coordinates from the camera's initial position.
    spherical.current.setFromVector3(
      new Vector3().subVectors(camera.position, TARGET),
    )

    const apply = () => {
      const s = spherical.current
      s.phi = Math.min(MAX_POLAR, Math.max(MIN_POLAR, s.phi))
      s.radius = Math.min(MAX_RADIUS, Math.max(MIN_RADIUS, s.radius))
      camera.position.setFromSpherical(s).add(TARGET)
      camera.lookAt(TARGET)
    }
    apply()

    const onDown = (e: PointerEvent) => {
      dragging.current = true
      prev.current = { x: e.clientX, y: e.clientY }
      canvas.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - prev.current.x
      const dy = e.clientY - prev.current.y
      prev.current = { x: e.clientX, y: e.clientY }
      spherical.current.theta -= dx * ROTATE_SPEED
      spherical.current.phi += dy * ROTATE_SPEED
      apply()
    }

    const onUp = (e: PointerEvent) => {
      dragging.current = false
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      spherical.current.radius += e.deltaY * ZOOM_SPEED
      apply()
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [camera, gl])

  return null
}

export default CameraControls
