import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type OperatorConfig = {
  jacketColor: string
  helmetColor: string
  houseLightColor: string
}

type Props = {
  open: boolean
  operator: OperatorConfig
  onOperatorHouseReady?: (obj: THREE.Object3D | null) => void
}

export default function Bridge({ open, operator, onOperatorHouseReady }: Props) {
  const platformRef = useRef<THREE.Mesh | null>(null)
  const operatorHouseRef = useRef<THREE.Group | null>(null)
  const operatorRef = useRef<THREE.Group | null>(null)

  const cableCurveLeft = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(-3.4, 8.2, 0), new THREE.Vector3(-3.4, 6.6, 0), new THREE.Vector3(-3.4, 5.2, 0)]),
    [],
  )
  const cableCurveRight = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(3.4, 8.2, 0), new THREE.Vector3(3.4, 6.6, 0), new THREE.Vector3(3.4, 5.2, 0)]),
    [],
  )

  useFrame((state, delta) => {
    if (platformRef.current) {
      const targetY = open ? 6.2 : 0
      platformRef.current.position.y += (targetY - platformRef.current.position.y) * Math.min(delta * 1.1, 1)
    }

    if (operatorRef.current) {
      operatorRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.25
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[70, 0.08, 18]} />
        <meshStandardMaterial color="#2f3238" roughness={0.9} />
      </mesh>

      <mesh position={[-3.5, 4.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 8.4, 1.2]} />
        <meshStandardMaterial color="#c2c5ca" metalness={0.45} roughness={0.33} />
      </mesh>
      <mesh position={[3.5, 4.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 8.4, 1.2]} />
        <meshStandardMaterial color="#c2c5ca" metalness={0.45} roughness={0.33} />
      </mesh>

      <mesh ref={platformRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.45, 4.4]} />
        <meshStandardMaterial color="#6f5440" metalness={0.25} roughness={0.65} />
      </mesh>

      <mesh position={[0, 0.4, 1.8]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.25, 0.18]} />
        <meshStandardMaterial color="#888e96" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.4, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.25, 0.18]} />
        <meshStandardMaterial color="#888e96" metalness={0.55} roughness={0.35} />
      </mesh>

      <mesh position={[0, 8.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[10.5, 0.4, 1.2]} />
        <meshStandardMaterial color="#a8adb4" metalness={0.45} roughness={0.32} />
      </mesh>

      <mesh position={[-3.4, 6.7, 0]}>
        <tubeGeometry args={[cableCurveLeft, 16, 0.06, 8, false]} />
        <meshStandardMaterial color="#24262a" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[3.4, 6.7, 0]}>
        <tubeGeometry args={[cableCurveRight, 16, 0.06, 8, false]} />
        <meshStandardMaterial color="#24262a" metalness={0.7} roughness={0.25} />
      </mesh>

      <group
        position={[0, 7.6, 0]}
        ref={(obj) => {
          operatorHouseRef.current = obj
          onOperatorHouseReady?.(obj)
        }}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.2, 1.8]} />
          <meshStandardMaterial color="#4b5868" metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.1, 0.91]}>
          <planeGeometry args={[1.8, 0.75]} />
          <meshStandardMaterial color="#9ec9ff" emissive={operator.houseLightColor} emissiveIntensity={0.45} />
        </mesh>

        <group ref={operatorRef} position={[0, -0.2, 0]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.24, 0.55, 16]} />
            <meshStandardMaterial color={operator.jacketColor} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.56, 0]} castShadow>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshStandardMaterial color="#f3d0b8" roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.68, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.2, 0.1, 16]} />
            <meshStandardMaterial color={operator.helmetColor} metalness={0.25} roughness={0.6} />
          </mesh>
        </group>
      </group>

      <mesh position={[-14, 0.42, -7]} rotation={[0, 0.13, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.2, 2]} />
        <meshStandardMaterial color="#c95443" roughness={0.7} />
      </mesh>
      <mesh position={[-14, 1.1, -7]} rotation={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[2.3, 0.8, 1.4]} />
        <meshStandardMaterial color="#f4f8fb" roughness={0.4} />
      </mesh>

      <mesh position={[-10, 0.3, 4.8]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.6, 0.95]} />
        <meshStandardMaterial color="#2f77c7" roughness={0.55} />
      </mesh>
      <mesh position={[8, 0.3, 4.4]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.6, 1.0]} />
        <meshStandardMaterial color="#f7a62b" roughness={0.55} />
      </mesh>
    </group>
  )
}
