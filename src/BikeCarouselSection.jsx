import { useRef, useEffect } from 'react';
import gsap from 'gsap';

function ArrowIcon({ direction }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path
        d={direction === 'next' ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 21c8-1 14-7 15-15C12 7 6 13 5 21z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13l4-4M9 5h6" strokeLinecap="round" />
    </svg>
  );
}

function SpringIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 3v3l6 2-6 2 6 2-6 2 6 2v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const FEATURES = [
  { Icon: BoltIcon, title: 'Lightning Fast', desc: 'Built for explosive speed on every terrain.' },
  { Icon: ShieldIcon, title: 'Unstoppable Control', desc: 'Advanced suspension for ultimate stability.' },
  { Icon: LeafIcon, title: 'Lightweight Frame', desc: 'Premium materials for maximum performance.' },
  { Icon: CogIcon, title: 'Precision Engineering', desc: 'Every detail crafted for perfection.' },
];

const STATS = [
  { Icon: GaugeIcon, value: '29"', label: 'Wheel Size' },
  { Icon: SpringIcon, value: '160mm', label: 'Travel' },
  { Icon: LeafIcon, value: '13.2kg', label: 'Weight' },
  { Icon: CogIcon, value: '12 Speed', label: 'Drivetrain' },
];

// The hero: badge + headline + description + CTAs on the left, a feature
// list on the right, a stat bar along the bottom edge, and unobtrusive
// next/prev + dots so the underlying 3-bike carousel is still reachable.
// The 3D model itself is NOT rendered here — it's the same persistent
// canvas from Scene.jsx (see App.jsx's HeroBackdrop for the rock pedestal
// and glow, which must live behind that canvas, not in this component).
export default function BikeCarouselSection({ bikes, activeIndex, onSelect }) {
  const headlineRef = useRef(null);
  const active = bikes[activeIndex];

  useEffect(() => {
    gsap.fromTo(headlineRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  }, [activeIndex]);

  const select = (i) => {
    if (i === activeIndex) return;
    onSelect(i);
  };

  return (
    <>
      {/* Left column: badge, headline, description, CTAs */}
      <div className="absolute left-4 sm:left-6 md:left-16 top-[26%] sm:top-1/2 sm:-translate-y-1/2 max-w-[88vw] sm:max-w-md z-10">
        <span
          className="inline-block rounded-full border px-3 py-1 text-[9px] sm:text-[10px] tracking-[0.25em] uppercase mb-3 sm:mb-5"
          style={{ borderColor: `${active.color}66`, color: active.color }}
        >
          2025 Collection
        </span>

        <h1 ref={headlineRef} className="font-display leading-[1.05] text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-5">
          <span className="block text-white">Ride The</span>
          <span className="block uppercase" style={{ color: active.color }}>
            {active.name}
          </span>
        </h1>

        <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-7">
          Engineered for speed. Built for control.
          <br />
          Dominate every trail with <span className="text-white">{active.name}</span>.
        </p>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            className="rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-black flex items-center gap-2 transition-transform hover:scale-105"
            style={{ backgroundColor: active.color }}
          >
            Pre-order Now
            <span>→</span>
          </button>
          <button className="flex items-center gap-2 text-white text-xs sm:text-sm">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/25 flex items-center justify-center shrink-0">
              <PlayIcon />
            </span>
            <span className="hidden xs:inline">Watch Video</span>
          </button>
        </div>
      </div>

      {/* Right column: feature list */}
      <div className="hidden lg:flex flex-col absolute right-16 top-1/2 -translate-y-1/2 w-72 divide-y divide-white/10 z-10">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span
              className="w-9 h-9 shrink-0 rounded-full border flex items-center justify-center"
              style={{ borderColor: `${active.color}55`, color: active.color }}
            >
              <Icon />
            </span>
            <div>
              <h3 className="text-white text-sm font-semibold mb-0.5">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom stat bar */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-4xl z-10">
        <div className="grid grid-cols-2 gap-x-2 gap-y-3 sm:flex sm:items-center sm:justify-around rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm px-3 sm:px-4 md:px-10 py-3 sm:py-4 sm:divide-x sm:divide-white/10">
          {STATS.map(({ Icon, value, label }) => (
            <div key={label} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4">
              <span
                className="w-7 h-7 sm:w-9 sm:h-9 shrink-0 rounded-full border flex items-center justify-center"
                style={{ borderColor: `${active.color}55`, color: active.color }}
              >
                <Icon />
              </span>
              <div className="min-w-0">
                <div className="text-white text-xs sm:text-sm md:text-lg font-semibold leading-tight truncate">{value}</div>
                <div className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wide truncate">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unobtrusive next/prev + dots so the 3-bike carousel stays reachable */}
      <button
        onClick={() => select((activeIndex - 1 + bikes.length) % bikes.length)}
        className="hidden sm:flex absolute left-4 top-[38%] z-10 w-9 h-9 rounded-full border border-white/10 items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
        aria-label="Previous bike"
      >
        <ArrowIcon direction="prev" />
      </button>
      <button
        onClick={() => select((activeIndex + 1) % bikes.length)}
        className="hidden sm:flex absolute right-4 top-[38%] z-10 w-9 h-9 rounded-full border border-white/10 items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
        aria-label="Next bike"
      >
        <ArrowIcon direction="next" />
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-36 sm:bottom-28 flex items-center gap-2 z-10">
        {bikes.map((bike, i) => (
          <button
            key={bike.name}
            onClick={() => select(i)}
            aria-label={`Show ${bike.name}`}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              backgroundColor: i === activeIndex ? bike.color : 'rgba(255,255,255,0.2)',
              transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </>
  );
}
