import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  open: boolean
}

export default function Bridge({ open }: Props) {
  const group = useRef<THREE.Group | null>(null)
  const platformRef = useRef<THREE.Mesh | null>(null)
  const speed = 1.2

  useFrame((state, delta) => {
    if (!platformRef.current) return
    const targetY = open ? 6 : 0
    platformRef.current.position.y += (targetY - platformRef.current.position.y) * Math.min(delta * speed, 1)
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Towers */}
      <mesh position={[-3.5, 3, 0]} castShadow>
        <boxGeometry args={[1, 6, 1]} />
        <meshStandardMaterial color="#b8b8b8" />
      </mesh>
      <mesh position={[3.5, 3, 0]} castShadow>
        <boxGeometry args={[1, 6, 1]} />
        <meshStandardMaterial color="#b8b8b8" />
      </mesh>

      {/* Platform that lifts between towers */}
      <mesh ref={platformRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.4, 4]} />
        <meshStandardMaterial color="#6b4f3c" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Cables (simple lines) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-3.5, 6, -0.4, -1.0, 4, -0.4])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#222" />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([3.5, 6, -0.4, 1.0, 4, -0.4])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#222" />
      </line>

      {/* Simple boat placeholder */}
      <mesh position={[-6, 0.8, -8]} rotation={[0, 0.2, 0]}> 
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#a23d2a" />
      </mesh>

      {/* Simple vehicle placeholder */}
      <mesh position={[-6, 0.2, 6]}>
        <boxGeometry args={[1.6, 0.6, 0.9]} />
        <meshStandardMaterial color="#2a6fa2" />
      </mesh>
    </group>
  )
}
