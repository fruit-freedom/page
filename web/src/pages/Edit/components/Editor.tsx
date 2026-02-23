import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Group } from 'three'

interface TShirtProps {
  sleeveSize?: number
  groupRef: React.RefObject<Group | null>
}

function TShirt({ sleeveSize = 1.0, groupRef }: TShirtProps) {
  // Calculate sleeve dimensions based on sleeveSize parameter
  const sleeveTopRadius = 0.12 * sleeveSize
  const sleeveBottomRadius = 0.18 * sleeveSize
  const sleeveLength = 0.7 * sleeveSize

  return (
    <group ref={groupRef}>
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

function RotationControls({ 
  groupRef, 
  onDragChange 
}: { 
  groupRef: React.RefObject<Group | null>
  onDragChange: (isDragging: boolean) => void 
}) {
  const { gl } = useThree()
  const isDraggingRef = useRef(false)
  const previousPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement
    let pointerId: number | null = null

    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault()
      isDraggingRef.current = true
      onDragChange(true)
      previousPositionRef.current = { x: e.clientX, y: e.clientY }
      pointerId = e.pointerId
      canvas.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return
      e.preventDefault()

      const deltaX = e.clientX - previousPositionRef.current.x
      const deltaY = e.clientY - previousPositionRef.current.y

      groupRef.current.rotation.y += deltaX * 0.01
      groupRef.current.rotation.x += deltaY * 0.01

      previousPositionRef.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (pointerId === e.pointerId) {
        isDraggingRef.current = false
        onDragChange(false)
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId)
        }
        pointerId = null
      }
    }

    const handlePointerCancel = (e: PointerEvent) => {
      if (pointerId === e.pointerId) {
        isDraggingRef.current = false
        onDragChange(false)
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId)
        }
        pointerId = null
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerCancel)
    
    // Prevent default touch behaviors
    canvas.style.touchAction = 'none'

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [gl, groupRef, onDragChange])

  return null
}

export interface EditorHandle {
  setSleeveSize: (size: number) => void
}

const Editor = forwardRef<EditorHandle>((_, ref) => {
  const [isDragging, setIsDragging] = useState(false)
  const [sleeveSize, setSleeveSize] = useState(1.0)
  const tShirtGroupRef = useRef<Group>(null)

  useImperativeHandle(ref, () => ({
    setSleeveSize: (size: number) => {
      setSleeveSize(size)
    },
  }))

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ 
        width: '100%', 
        height: '90%', 
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <TShirt groupRef={tShirtGroupRef} sleeveSize={sleeveSize} />
      <RotationControls groupRef={tShirtGroupRef} onDragChange={setIsDragging} />
      <ZoomControls />
    </Canvas>
  )
})

// Editor.displayName = 'Editor'

export default Editor

