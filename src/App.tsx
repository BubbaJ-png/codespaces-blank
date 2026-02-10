import React, { useEffect, useMemo, useRef, useState } from 'react'
import { VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { Environment, OrbitControls, Sky, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Bridge from './scene/Bridge'

type ViewMode = 'overview' | 'operator' | 'character'

type OperatorConfig = {
  jacketColor: string
  helmetColor: string
  houseLightColor: string
}

function AddVRButton() {
  const { gl } = useThree()
  useEffect(() => {
    let btn: HTMLElement | null = null
    import('three/examples/jsm/webxr/VRButton').then((mod: any) => {
      try {
        const b = mod?.VRButton?.createButton(gl)
        if (b) {
          btn = b
          document.body.appendChild(b)
        }
      } catch {
        // ignore when WebXR is unavailable
      }
    })

    return () => {
      if (btn && btn.parentElement) btn.parentElement.removeChild(btn)
    }
  }, [gl])

  return null
}

function MoveableCharacter({ active, onTargetUpdate }: { active: boolean; onTargetUpdate: (target: THREE.Vector3) => void }) {
  const ref = useRef<THREE.Group | null>(null)
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return

    const speed = active ? 5.2 : 0
    const forward = (keys.current['KeyW'] ? 1 : 0) - (keys.current['KeyS'] ? 1 : 0)
    const strafe = (keys.current['KeyD'] ? 1 : 0) - (keys.current['KeyA'] ? 1 : 0)

    velocity.set(strafe, 0, -forward)
    if (velocity.lengthSq() > 0) {
      velocity.normalize().multiplyScalar(speed * delta)
      ref.current.position.add(velocity)
      ref.current.position.x = THREE.MathUtils.clamp(ref.current.position.x, -26, 26)
      ref.current.position.z = THREE.MathUtils.clamp(ref.current.position.z, -10, 10)
      ref.current.rotation.y = Math.atan2(velocity.x, velocity.z)
    }

    const viewTarget = ref.current.position.clone().add(new THREE.Vector3(0, 1.7, 0.4))
    onTargetUpdate(viewTarget)
  })

  return (
    <group ref={ref} position={[12, 0, 5]}>
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.35, 1.1, 8, 16]} />
        <meshStandardMaterial color="#233445" roughness={0.7} />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.28, 20, 20]} />
        <meshStandardMaterial color="#eecab1" roughness={0.75} />
      </mesh>
    </group>
  )
}

function CameraDirector({
  mode,
  operatorHouse,
  characterTarget,
}: {
  mode: ViewMode
  operatorHouse: THREE.Object3D | null
  characterTarget: THREE.Vector3
}) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const smoothing = Math.min(1, delta * 2.6)

    if (mode === 'operator' && operatorHouse) {
      const desired = operatorHouse.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.4, 1.55))
      camera.position.lerp(desired, smoothing)
      camera.lookAt(0, 6.5, -2)
      return
    }

    if (mode === 'character') {
      const desired = characterTarget.clone().add(new THREE.Vector3(0, 0.2, 0.1))
      const look = characterTarget.clone().add(new THREE.Vector3(0, 0, -4))
      camera.position.lerp(desired, smoothing)
      camera.lookAt(look)
      return
    }

    const overviewPos = new THREE.Vector3(15, 9, 18)
    camera.position.lerp(overviewPos, smoothing)
    camera.lookAt(0, 2.6, 0)
  })

  return null
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [operatorHouse, setOperatorHouse] = useState<THREE.Object3D | null>(null)
  const [characterTarget, setCharacterTarget] = useState(new THREE.Vector3(12, 1.7, 5.4))
  const [operatorConfig, setOperatorConfig] = useState<OperatorConfig>({
    jacketColor: '#f3a321',
    helmetColor: '#ffe24c',
    houseLightColor: '#66c7ff',
  })

  return (
    <div className="app-root">
      <div className="ui">
        <h1>Duluth Aerial Lift Bridge Simulator</h1>
        <div className="controls-row">
          <button onClick={() => setOpen((s) => !s)}>{open ? 'Lower Bridge' : 'Raise Bridge'}</button>
          <label>
            Camera
            <select value={viewMode} onChange={(e) => setViewMode(e.target.value as ViewMode)}>
              <option value="overview">Overview</option>
              <option value="operator">Operator House View</option>
              <option value="character">Movable Character View</option>
            </select>
          </label>
        </div>

        <div className="customization">
          <h2>Operator Customization</h2>
          <label>
            Jacket
            <input
              type="color"
              value={operatorConfig.jacketColor}
              onChange={(e) => setOperatorConfig((old) => ({ ...old, jacketColor: e.target.value }))}
            />
          </label>
          <label>
            Helmet
            <input
              type="color"
              value={operatorConfig.helmetColor}
              onChange={(e) => setOperatorConfig((old) => ({ ...old, helmetColor: e.target.value }))}
            />
          </label>
          <label>
            House Light
            <input
              type="color"
              value={operatorConfig.houseLightColor}
              onChange={(e) => setOperatorConfig((old) => ({ ...old, houseLightColor: e.target.value }))}
            />
          </label>
        </div>

        <p>W / A / S / D moves the character when Character View is active.</p>
      </div>

      <VRCanvas className="canvas" shadows camera={{ position: [15, 9, 18], fov: 58 }}>
        <fog attach="fog" args={['#8da8bf', 18, 100]} />
        <ambientLight intensity={0.35} />
        <directionalLight castShadow intensity={1.2} position={[18, 25, 10]} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <spotLight position={[0, 12, 2]} intensity={0.8} angle={0.3} penumbra={0.4} color={operatorConfig.houseLightColor} />
        <Sky sunPosition={[120, 25, -40]} />
        <Stars radius={150} depth={60} count={4000} factor={4} saturation={0.1} fade speed={0.2} />
        <Environment preset="city" />

        <Bridge open={open} operator={operatorConfig} onOperatorHouseReady={setOperatorHouse} />

        <MoveableCharacter active={viewMode === 'character'} onTargetUpdate={setCharacterTarget} />
        <CameraDirector mode={viewMode} operatorHouse={operatorHouse} characterTarget={characterTarget} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[240, 240]} />
          <meshStandardMaterial color="#405a67" metalness={0.2} roughness={0.85} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -8]} receiveShadow>
          <planeGeometry args={[240, 65]} />
          <meshPhysicalMaterial color="#274e63" roughness={0.14} metalness={0.04} transmission={0.2} thickness={0.8} />
        </mesh>

        <OrbitControls enableDamping enabled={viewMode === 'overview'} target={[0, 2.5, 0]} />
        <DefaultXRControllers />
        <AddVRButton />
      </VRCanvas>
    </div>
  )
}
