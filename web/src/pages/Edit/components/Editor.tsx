import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Group } from 'three'

interface TShirtProps {
  onDragChange: (isDragging: boolean) => void
  sleeveSize?: number
}

function TShirt({ onDragChange, sleeveSize = 1.0 }: TShirtProps) {
  const groupRef = useRef<Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 })

  // Calculate sleeve dimensions based on sleeveSize parameter
  const sleeveTopRadius = 0.12 * sleeveSize
  const sleeveBottomRadius = 0.18 * sleeveSize
  const sleeveLength = 0.7 * sleeveSize

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    onDragChange(true)
    setPreviousMousePosition({ x: e.clientX, y: e.clientY })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !groupRef.current) return

    const deltaX = e.clientX - previousMousePosition.x
    const deltaY = e.clientY - previousMousePosition.y

    groupRef.current.rotation.y += deltaX * 0.01
    groupRef.current.rotation.x += deltaY * 0.01

    setPreviousMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false)
    onDragChange(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Main torso/body - slightly tapered */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.1, 1.6, 0.25]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Left shoulder/armhole connection */}
      <mesh position={[-0.55, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.25]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right shoulder/armhole connection */}
      <mesh position={[0.55, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.25]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.75, 0.2, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[sleeveTopRadius, sleeveBottomRadius, sleeveLength, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.75, 0.2, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[sleeveTopRadius, sleeveBottomRadius, sleeveLength, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Neck opening - circular collar */}
      <mesh position={[0, 0.7, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.18, 0.03, 16, 32]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

function ZoomControls() {
  const { camera, gl } = useThree()

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * 0.01
      const newZ = Math.max(1, Math.min(10, camera.position.z + delta))
      camera.position.z = newZ
      camera.updateProjectionMatrix()
    }

    const canvas = gl.domElement
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [camera, gl])

  return null
}

export interface EditorHandle {
  setSleeveSize: (size: number) => void
}

const Editor = forwardRef<EditorHandle>((_, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const [sleeveSize, setSleeveSize] = useState(1.0)

  useImperativeHandle(ref, () => ({
    setSleeveSize: (size: number) => {
      setSleeveSize(size)
    },
  }))

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <TShirt onDragChange={setIsDragging} sleeveSize={sleeveSize} />
      <ZoomControls />
    </Canvas>
  )
})

// Editor.displayName = 'Editor'

export default Editor

