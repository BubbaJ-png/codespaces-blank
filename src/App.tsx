import React, { useState, useEffect } from 'react'
import { VRCanvas, DefaultXRControllers } from '@react-three/xr'
import { OrbitControls, Sky } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Bridge from './scene/Bridge'

function AddVRButton() {
  const { gl } = useThree()
  useEffect(() => {
    let btn: HTMLElement | null = null
    // dynamic import to avoid missing type declaration errors for examples/*
    import('three/examples/jsm/webxr/VRButton')
      .then((mod: any) => {
        try {
          const b = mod?.VRButton?.createButton(gl)
          if (b) {
            btn = b
            document.body.appendChild(b)
          }
        } catch (e) {
          // ignore
        }
      })
    return () => {
      if (btn && btn.parentElement) btn.parentElement.removeChild(btn)
    }
  }, [gl])
  return null
}

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className="app-root">
      <div className="ui">
        <button onClick={() => setOpen((s) => !s)}>{open ? 'Lower Bridge' : 'Raise Bridge'}</button>
        <p>Tip: Use the VR button (if available) to enter VR or use a WebXR-capable headset.</p>
      </div>

      <VRCanvas className="canvas" shadows camera={{ position: [0, 5, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight castShadow intensity={0.8} position={[10, 15, 10]} />
        <Sky sunPosition={[100, 20, 100]} />

        <Bridge open={open} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#4b5d67" />
        </mesh>

        <OrbitControls makeDefault />
        <DefaultXRControllers />
        <AddVRButton />
      </VRCanvas>
    </div>
  )
}
