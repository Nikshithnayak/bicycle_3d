import { useControls, button } from 'leva';
import { useFrame } from '@react-three/fiber';
import { CAMERA_KEYFRAMES } from './useScrollCamera';

const SECTION_LABELS = [
  '1 — Hero (Carousel)',
  '2 — Dominance',
  '3 — Weight',
  '4 — Speed',
  '5 — Transition',
  '6 — Story',
];

function formatKeyframe({ position, target, fov }) {
  const p = position.map((n) => n.toFixed(2));
  const t = target.map((n) => n.toFixed(2));
  return `{ position: [${p.join(', ')}], target: [${t.join(', ')}], fov: ${fov.toFixed(1)} },`;
}

// Only mounted when ?debug=true — feeds cameraState directly from Leva
// sliders every frame, bypassing the GSAP ScrollTrigger timeline so you can
// freely dial in an angle against a reference screenshot.
export default function DebugCameraPanel({ cameraState }) {
  const [values, set] = useControls('Camera Debug', () => ({
    section: {
      label: 'Jump to keyframe',
      options: SECTION_LABELS.reduce((acc, label, i) => {
        acc[label] = i;
        return acc;
      }, {}),
      value: 0,
      onChange: (idx) => {
        const kf = CAMERA_KEYFRAMES[idx];
        set({
          positionX: kf.position[0],
          positionY: kf.position[1],
          positionZ: kf.position[2],
          targetX: kf.target[0],
          targetY: kf.target[1],
          targetZ: kf.target[2],
          fov: kf.fov,
        });
      },
    },
    positionX: { value: CAMERA_KEYFRAMES[0].position[0], min: -10, max: 10, step: 0.05 },
    positionY: { value: CAMERA_KEYFRAMES[0].position[1], min: -10, max: 10, step: 0.05 },
    positionZ: { value: CAMERA_KEYFRAMES[0].position[2], min: -10, max: 10, step: 0.05 },
    targetX: { value: CAMERA_KEYFRAMES[0].target[0], min: -5, max: 5, step: 0.05 },
    targetY: { value: CAMERA_KEYFRAMES[0].target[1], min: -5, max: 5, step: 0.05 },
    targetZ: { value: CAMERA_KEYFRAMES[0].target[2], min: -5, max: 5, step: 0.05 },
    fov: { value: CAMERA_KEYFRAMES[0].fov, min: 10, max: 80, step: 0.5 },
    'Copy keyframe': button((get) => {
      const text = formatKeyframe({
        position: [get('Camera Debug.positionX'), get('Camera Debug.positionY'), get('Camera Debug.positionZ')],
        target: [get('Camera Debug.targetX'), get('Camera Debug.targetY'), get('Camera Debug.targetZ')],
        fov: get('Camera Debug.fov'),
      });
      console.log('[SURGE camera keyframe]', text);
      navigator.clipboard?.writeText(text).catch(() => {});
    }),
  }));

  // Runs every frame: overrides the scroll-driven camera state entirely
  // while debug mode is active.
  useFrame(() => {
    cameraState.current = {
      position: [values.positionX, values.positionY, values.positionZ],
      target: [values.targetX, values.targetY, values.targetZ],
      fov: values.fov,
    };
  });

  return null;
}
