import { useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'

interface PlotProps {
  position: [number, number, number]
  planted: boolean
  onToggle: () => void
}

function Plot({ position, planted, onToggle }: PlotProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // Ignore clicks that were actually camera-rotation drags.
    if (e.delta > 5) return
    onToggle()
  }

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handleOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={handleOver}
      onPointerOut={handleOut}
    >
      {/* Soil */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.4, 1.4]} />
        <meshStandardMaterial color={hovered ? '#a9744f' : '#8b5a2b'} />
      </mesh>

      {/* Plant (trunk + canopy) */}
      {planted && (
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.5, 8]} />
            <meshStandardMaterial color="#7b4a2b" />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#2ecc71" />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default Plot
