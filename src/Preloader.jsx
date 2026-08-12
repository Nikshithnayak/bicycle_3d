import { useEffect, useState, useRef } from 'react';

// Circular wheel-outline loader: an SVG ring shaped like a bicycle wheel
// (rim + spokes) draws itself in as an actual 0-100% counter ticks up,
// tracking real page load instead of a canned animation. Sits above
// everything until the window fires 'load', then fades out and unmounts.
export default function Preloader() {
  const [percent, setPercent] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const targetRef = useRef(0);

  useEffect(() => {
    // Advance a soft "believable" progress target while real resources
    // load, but never let the displayed number claim 100 until the
    // window actually finishes loading.
    let raf;
    const tick = () => {
      setPercent((p) => {
        const target = targetRef.current;
        const next = p + (target - p) * 0.08 + 0.15;
        return Math.min(next, target);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const bump = setInterval(() => {
      targetRef.current = Math.min(targetRef.current + Math.random() * 8, 90);
    }, 220);

    const finish = () => {
      clearInterval(bump);
      targetRef.current = 100;
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(bump);
      window.removeEventListener('load', finish);
    };
  }, []);

  useEffect(() => {
    if (percent >= 100 && !done) {
      setDone(true);
      const t = setTimeout(() => setHidden(true), 600);
      return () => clearTimeout(t);
    }
  }, [percent, done]);

  if (hidden) return null;

  const shown = Math.floor(percent);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-600 ease-out ${
        done ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-[180px] h-[180px] flex items-center justify-center">
        <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
          {/* static faint wheel outline */}
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#ffffff14" strokeWidth="2" />
          {/* spokes, like a bicycle wheel */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * Math.PI) / 6;
            const x1 = 90 + Math.cos(angle) * 14;
            const y1 = 90 + Math.sin(angle) * 14;
            const x2 = 90 + Math.cos(angle) * (radius - 4);
            const y2 = 90 + Math.sin(angle) * (radius - 4);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffffff10"
                strokeWidth="1"
              />
            );
          })}
          <circle cx="90" cy="90" r="14" fill="none" stroke="#ffffff1a" strokeWidth="2" />

          {/* animated progress ring */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: 'drop-shadow(0 0 6px #ef444499)' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-white text-3xl tabular-nums leading-none">
            {shown}
            <span className="text-lg align-top">%</span>
          </span>
          <span className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mt-2">
            Speactra
          </span>
        </div>
      </div>
    </div>
  );
}
