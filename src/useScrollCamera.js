import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 6 camera keyframes, one per scroll section. Positions/targets are in
// Three.js world units, tuned around a bike centered at [0,0,0].
// NUDGE THESE once the real bike.glb scale/origin is confirmed in-scene.
export const CAMERA_KEYFRAMES = [
  // 1. Hero — the bike carousel — dialed in via debug camera panel
  { position: [3.75, 0.50, 1.75], target: [0.05, 0.55, 0.05], fov: 29.0 },
  // 2. Original hero copy ("Dominance on Two Wheels") — dialed in via debug camera panel
  { position: [0.60, 0.50, 10.00], target: [0.05, 0.55, 0.10], fov: 13.5 },
  // 3. Weight stat — dialed in via debug camera panel
  { position: [-8.05, -2.25, 4.35], target: [-0.05, 0.50, 0.25], fov: 16.5 },
  // 4. Speed stat — dialed in via debug camera panel
  { position: [2.85, 0.00, 2.35], target: [0.40, 0.50, 0.25], fov: 34.5 },
  // 5. Transition — dialed in via debug camera panel
  { position: [5.40, -2.35, -2.65], target: [0.55, 0.15, -0.25], fov: 22.0 },
  // 6. Brand story — dialed in via debug camera panel
  { position: [3.50, 0.95, 1.35], target: [0.25, 0.60, 0.00], fov: 19.5 },
];

const NUM_SECTIONS = CAMERA_KEYFRAMES.length;

/**
 * Drives a shared camera-state ref via a GSAP timeline pinned to document
 * scroll. r3f's useFrame reads cameraState.current each frame and lerps
 * the actual camera to match (see Scene.jsx).
 */
export function useScrollCamera(debugMode = false) {
  const cameraState = useRef({
    position: [...CAMERA_KEYFRAMES[0].position],
    target: [...CAMERA_KEYFRAMES[0].target],
    fov: CAMERA_KEYFRAMES[0].fov,
  });

  useEffect(() => {
    // Debug mode drives cameraState from DebugCameraPanel's sliders instead.
    if (debugMode) return;

    const totalSegments = NUM_SECTIONS - 1;

    // Dead-zone at the very top of the page: GSAP's scrub smoothing has lag,
    // and tiny scroll jitter (e.g. a button click nudging scroll by a few
    // px) was enough to blend the camera slightly toward keyframe 2,
    // changing the bike's apparent size in the carousel section. Snapping
    // to an exact keyframe 0 for the first sliver of scroll keeps that
    // section's framing pixel-identical no matter how it was reached.
    const START_DEADZONE = 0.01;

    const applyProgress = (t) => {
      if (t < START_DEADZONE) {
        cameraState.current = {
          position: [...CAMERA_KEYFRAMES[0].position],
          target: [...CAMERA_KEYFRAMES[0].target],
          fov: CAMERA_KEYFRAMES[0].fov,
        };
        return;
      }

      const scaled = t * totalSegments;
      let idx = Math.floor(scaled);
      if (idx >= totalSegments) idx = totalSegments - 1;
      const localT = scaled - idx;

      const a = CAMERA_KEYFRAMES[idx];
      const b = CAMERA_KEYFRAMES[idx + 1];

      cameraState.current = {
        position: [
          gsap.utils.interpolate(a.position[0], b.position[0], localT),
          gsap.utils.interpolate(a.position[1], b.position[1], localT),
          gsap.utils.interpolate(a.position[2], b.position[2], localT),
        ],
        target: [
          gsap.utils.interpolate(a.target[0], b.target[0], localT),
          gsap.utils.interpolate(a.target[1], b.target[1], localT),
          gsap.utils.interpolate(a.target[2], b.target[2], localT),
        ],
        fov: gsap.utils.interpolate(a.fov, b.fov, localT),
      };
    };

    const trigger = ScrollTrigger.create({
      trigger: '#scroll-root',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => applyProgress(self.progress),
    });

    return () => trigger.kill();
  }, [debugMode]);

  return cameraState;
}
