# Duluth Aerial Lift Bridge — WebVR Simulator (Three.js + React)

This repo is a minimal WebXR-capable simulator built with Vite, React, and Three.js using `@react-three/fiber` and `@react-three/xr`.

## Quick start

1. Install:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. Open http://localhost:5173 in a WebXR-capable browser (Chrome / Edge recommended).

## VR testing notes

- On desktop you can use the **WebXR Emulator** Chrome extension to emulate an HMD and controllers.
- For real-device testing, access the site over HTTPS (e.g. use `npm run preview` and host on an HTTPS server) and open the page from your headset's browser.
- The scene exposes a simple UI button to raise/lower the bridge and a VR entry button if your browser supports WebXR.

## Features (MVP)

- Procedural bridge model with an animated lift platform
- Basic boat and vehicle placeholders
- VR entry / controller support via `@react-three/xr`

## Next steps / improvements

- Replace placeholders with high-fidelity glTF models
- Add accurate timings/real-world schedule data
- Add teleportation and grabbed-object interactions in VR
- Polish visuals and add sounds

Enjoy — say "enter VR" and try the simulator with a headset or the emulator extension!
