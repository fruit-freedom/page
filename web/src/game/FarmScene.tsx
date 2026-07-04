import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Plot from './Plot'
import CameraControls from './CameraControls'

const GRID = 4 // 4 x 4 field
const SPACING = 1.7 // distance between plot centers

function FarmScene() {
  const [planted, setPlanted] = useState<boolean[]>(() =>
    Array(GRID * GRID).fill(false),
  )

  const toggle = (index: number) => {
    setPlanted((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      return next
    })
  }

  // Center the grid on the origin.
  const offset = ((GRID - 1) * SPACING) / 2

  return (
    <Canvas
      camera={{ position: [6, 7, 6], fov: 50, zoom: 0.7 }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <CameraControls />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#6ab150" />
      </mesh>

      {/* Field of plots */}
      {planted.map((isPlanted, i) => {
        const row = Math.floor(i / GRID)
        const col = i % GRID
        const x = col * SPACING - offset
        const z = row * SPACING - offset
        return (
          <Plot
            key={i}
            position={[x, 0, z]}
            planted={isPlanted}
            onToggle={() => toggle(i)}
          />
        )
      })}
    </Canvas>
  )
}

export default FarmScene
