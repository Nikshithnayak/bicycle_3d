import { Suspense, useRef, useEffect, useMemo, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollCamera } from './useScrollCamera';
import DebugCameraPanel from './DebugCameraPanel';

const isDebugMode = () =>
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true';

// AI-generated GLBs often arrive at an arbitrary scale/origin. Bike
// auto-normalizes to TARGET_HEIGHT world units and re-centers on load so the
// hand-tuned camera keyframes in useScrollCamera.js apply consistently.
// Nudge these once the real bike.glb's proportions are known.
//
// Normalize by HEIGHT (size.y), not the longest dimension — the 3 bike
// models have slightly different length/height ratios, so scaling by
// "max dimension" (usually length) made each one sit at a different
// visual height in the carousel even with an identical camera. Height is
// the one dimension that must match across variants for a fixed framing.
const TARGET_HEIGHT = 1.1;
const MODEL_OFFSET = [0, 0, 0];
const MODEL_SCALE = 1;

function Bike({ modelPath }) {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    // useGLTF caches scenes by URL, so revisiting a bike REMOUNTS this
    // component with the SAME already-normalized scene object. Measuring
    // its bounding box without resetting transforms first would measure
    // the already-scaled result, not the native size — producing a
    // different "corrected" scale each time (an oscillating big/small/big
    // bug). Reset to identity first so every run measures native geometry.
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const height = size.y || 1;
    const scale = (TARGET_HEIGHT / height) * MODEL_SCALE;

    scene.scale.setScalar(scale);
    scene.position.set(
      -center.x * scale + MODEL_OFFSET[0],
      -box.min.y * scale + MODEL_OFFSET[1],
      -center.z * scale + MODEL_OFFSET[2]
    );

    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

// ContactShadows (drei) multiply-blends its shadow plane, which is
// invisible against a transparent (alpha: true) canvas — there's nothing
// in the WebGL buffer to multiply against yet. A hand-built radial-gradient
// texture with normal alpha blending composites correctly instead.
function useRadialShadowTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.5, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

function GroundShadow() {
  const texture = useRadialShadowTexture();
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
      <circleGeometry args={[1.5, 64]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function CameraRig({ cameraState, debugMode }) {
  const camRef = useRef();
  const targetVec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!camRef.current) return;
    const { position, target, fov } = cameraState.current;

    // Debug mode: snap 1:1 to slider values, no smoothing lag.
    const lerpFactor = debugMode ? 1 : 0.08;

    camRef.current.position.lerp(new THREE.Vector3(position[0], position[1], position[2]), lerpFactor);
    targetVec.current.lerp(new THREE.Vector3(...target), lerpFactor);
    camRef.current.lookAt(targetVec.current);

    if (Math.abs(camRef.current.fov - fov) > 0.01) {
      camRef.current.fov = THREE.MathUtils.lerp(camRef.current.fov, fov, lerpFactor);
      camRef.current.updateProjectionMatrix();
    }
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      position={cameraState.current.position}
      fov={cameraState.current.fov}
      near={0.1}
      far={100}
    />
  );
}

// forwardRef exposes the outer wrapper (not the Canvas itself) so the
// carousel's next/prev handlers in App.jsx can GSAP-animate its transform
// (slide out left/right, swap model, slide back in) without touching the
// 3D camera system at all — a pure DOM-level slide on top of the WebGL output.
const Scene = forwardRef(function Scene({ modelPath = '/models/bike.glb' }, ref) {
  const debugMode = isDebugMode();
  const cameraState = useScrollCamera(debugMode);

  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 2 }}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.75,
        }}
        shadows
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <fog attach="fog" args={['#000000', 9, 22]} />

        <CameraRig cameraState={cameraState} debugMode={debugMode} />
        {debugMode && <DebugCameraPanel cameraState={cameraState} />}

        <ambientLight intensity={0.3} />
        {/* key light */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        />
        {/* fill light */}
        <directionalLight position={[-4, 1.5, -3]} intensity={0.4} />
        {/* rim light */}
        <directionalLight position={[-2, 3, -5]} intensity={0.6} color="#cfe0ff" />
        {/* soft top-down bounce to lighten shadow side */}
        <directionalLight position={[0, 8, 0]} intensity={0.3} />

        <Suspense fallback={null}>
          <Bike modelPath={modelPath} />
          <Environment preset="studio" environmentIntensity={0.4} />
          <GroundShadow />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default Scene;

useGLTF.preload('/models/bike.glb');
useGLTF.preload('/models/bike-vortex.glb');
useGLTF.preload('/models/bike-spectra.glb');
