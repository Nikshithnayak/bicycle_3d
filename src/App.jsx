import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import Scene from './Scene';
import Preloader from './Preloader';
import Navbar from './Navbar';
import LikeWidget from './LikeWidget';
import BikeCarouselSection from './BikeCarouselSection';
import { useSectionInView } from './useSectionInView';

// Only 3 real GLB models exist. Colors match each model's actual paint,
// not an arbitrary palette — bike.glb's frame is red, so its glow is red.
const BIKES = [
  { name: 'Ridge', model: '/models/bike.glb', color: '#ef4444', glow: '#991b1b' },
  { name: 'Vortex', model: '/models/bike-vortex.glb', color: '#22c55e', glow: '#15803d' },
  { name: 'Spectra', model: '/models/bike-spectra.glb', color: '#f59e0b', glow: '#b45309' },
];

// Hook: fades a fixed hero-only layer out as the user scrolls past section 1.
function useHeroScrollFade() {
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    const onScroll = () => {
      const fade = 1 - window.scrollY / (window.innerHeight * 0.8);
      setOpacity(Math.max(0, Math.min(1, fade)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return opacity;
}

// Everything behind the bike in the hero: radial glow, rock pedestal, and a
// giant ghost text of the active bike's name. All of it MUST live in this
// fixed z-[1] layer — between the page background and the transparent
// canvas (z-2) — not inside the z-10 content wrapper, otherwise it paints
// on top of the 3D bike itself instead of just the space around it. Fades
// out with scroll since it only belongs to the first section.
function HeroBackdrop({ name, color, glow }) {
  const glowRef = useRef(null);
  const opacity = useHeroScrollFade();

  useEffect(() => {
    if (glowRef.current) gsap.to(glowRef.current, { '--glow-color': glow, duration: 0.7, ease: 'power2.out' });
  }, [glow]);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none select-none" style={{ opacity }}>
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          '--glow-color': glow,
          background: 'radial-gradient(ellipse 65% 55% at 50% 58%, var(--glow-color) 0%, transparent 78%)',
          opacity: 0.65,
        }}
      />

      {/* Tighter, brighter spotlight centered on the rock so it reads as a
          dark silhouette against a strong color halo instead of blending
          into the background. */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 38% 32% at 50% 76%, ${color} 0%, transparent 70%)`,
          opacity: 0.85,
          mixBlendMode: 'screen',
        }}
      />

      {/* The source PNG has a lot of empty transparent space above the rock
          itself, so anchoring at bottom-0 leaves it looking too high up —
          push it down so the rock silhouette sits closer to the stat bar.
          The bike's screen position comes from a 3D perspective camera,
          which reframes based on viewport HEIGHT — but this 2D image was
          drifting out of alignment with it across window shapes (e.g.
          fullscreen removing browser chrome) because it was offset with
          fixed px/vw values. Using vh here instead keeps it tracking the
          bike consistently across viewport heights. */}
      <img
        src="/images/rock-pedestal.png"
        alt=""
        className="absolute left-1/2 -translate-x-1/2 w-[1000px] max-w-[78vw] object-contain brightness-50 contrast-125"
        style={{ bottom: '-2vh' }}
      />

      {/* Contact shadow: a flat photo composited with the 3D render will
          never pixel-align perfectly on its own — this blurred dark ellipse
          right at the wheel/rock seam fakes the missing contact shadow so
          the bike reads as resting on the rock instead of floating over it. */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{
          bottom: '34vh',
          width: '360px',
          height: '70px',
          background: 'rgba(0,0,0,0.75)',
        }}
      />

      {/* Positioned to sit behind the bike's body (not down near the rock),
          same "text behind bike" trick as elsewhere on the site — this
          layer is behind the transparent canvas, so the bike's opaque
          pixels naturally occlude the letters where they overlap. */}
      <h2
        className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-display tracking-wide text-[52px] sm:text-[80px] md:text-[170px] leading-none whitespace-nowrap uppercase"
        style={{ color, opacity: 0.08 }}
      >
        {name}
      </h2>
    </div>
  );
}

function BagIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8h12l1 13H5L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function Fade({ children, className = '', threshold = 0.45, from = 'left' }) {
  const [ref, inView] = useSectionInView(threshold);
  const translate =
    from === 'left'
      ? inView
        ? 'translate-x-0'
        : '-translate-x-8'
      : from === 'right'
      ? inView
        ? 'translate-x-0'
        : 'translate-x-8'
      : inView
      ? 'translate-y-0'
      : 'translate-y-8';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100' : 'opacity-0'
      } ${translate} ${className}`}
    >
      {children}
    </div>
  );
}

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`relative h-screen w-full ${className}`}>
      {children}
    </section>
  );
}

function DebugBadge() {
  const isDebug =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true';
  if (!isDebug) return null;
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-30 bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full pointer-events-none">
      Debug Mode — scroll camera disabled
    </div>
  );
}

export default function App() {
  const [activeBikeIndex, setActiveBikeIndex] = useState(0);
  const sceneWrapperRef = useRef(null);
  const isSwitchingBike = useRef(false);

  // Horizontal carousel swap: slide the whole shared canvas out one side,
  // swap the GLB while it's off-screen, then slide the new bike in from
  // the opposite side to rest at center — a pure DOM transform on Scene's
  // wrapper, independent of the 3D camera/scroll system.
  const switchBike = (newIndex) => {
    const el = sceneWrapperRef.current;
    if (!el || isSwitchingBike.current || newIndex === activeBikeIndex) return;
    isSwitchingBike.current = true;

    const total = BIKES.length;
    const forwardDist = (newIndex - activeBikeIndex + total) % total;
    const backwardDist = (activeBikeIndex - newIndex + total) % total;
    const direction = forwardDist <= backwardDist ? 'next' : 'prev';
    const outXPercent = direction === 'next' ? -35 : 35;
    const inXPercent = direction === 'next' ? 35 : -35;

    gsap.to(el, {
      xPercent: outXPercent,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => {
        setActiveBikeIndex(newIndex);
        gsap.set(el, { xPercent: inXPercent });
        gsap.to(el, {
          xPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.05,
          onComplete: () => {
            isSwitchingBike.current = false;
          },
        });
      },
    });
  };

  return (
    <>
      <Preloader />
      <Scene ref={sceneWrapperRef} modelPath={BIKES[activeBikeIndex].model} />
      <HeroBackdrop
        name={BIKES[activeBikeIndex].name}
        color={BIKES[activeBikeIndex].color}
        glow={BIKES[activeBikeIndex].glow}
      />
      <DebugBadge />
      <Navbar accentColor={BIKES[activeBikeIndex].color} />
      <LikeWidget />

      <div className="relative z-10">
      <div id="scroll-root">
        {/* 1. Hero — the bike carousel */}
        <Section id="hero">
          <BikeCarouselSection bikes={BIKES} activeIndex={activeBikeIndex} onSelect={switchBike} />
        </Section>

        {/* 2. Transition beat between the carousel and the rest of the scroll */}
        <Section id="dominance">
          <Fade from="left">
            <div className="absolute left-5 sm:left-8 md:left-16 top-[8%] md:top-44 flex flex-col gap-4 sm:gap-6 md:gap-10 max-w-[70vw] sm:max-w-none">
              {[
                { value: '45', unit: 'MPH', label: 'Top Speed' },
                { value: '60', unit: 'MI', label: 'Range Per Charge' },
              ].map(({ value, unit, label }) => (
                <div key={label} className="flex items-start gap-3 sm:gap-4">
                  <span
                    className="w-6 sm:w-8 h-px mt-3 sm:mt-4 shrink-0"
                    style={{ backgroundColor: BIKES[activeBikeIndex].color }}
                  />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-white text-3xl sm:text-4xl md:text-6xl leading-none">{value}</span>
                      <span className="text-gray-400 text-xs sm:text-sm tracking-wide">{unit}</span>
                    </div>
                    <div className="text-gray-500 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-1 sm:mt-2">{label}</div>
                  </div>
                </div>
              ))}
              <p className="hidden sm:block text-gray-400 text-sm leading-relaxed max-w-xs">
                Built for the ride that pushes back — instant torque and real range mean the
                {' '}{BIKES[activeBikeIndex].name} doesn't slow down when the trail gets serious.
              </p>
              <button
                className="hidden sm:block rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide uppercase text-white border transition-all hover:bg-white/10 w-fit"
                style={{
                  borderColor: `${BIKES[activeBikeIndex].color}80`,
                  boxShadow: `0 0 18px ${BIKES[activeBikeIndex].color}55`,
                }}
              >
                See Performance
              </button>
            </div>
          </Fade>

          <Fade from="right">
            <div className="absolute right-5 sm:right-8 md:right-16 top-[8%] md:top-44 flex flex-col gap-4 sm:gap-6 md:gap-10 items-end text-right max-w-[70vw] sm:max-w-none">
              {[
                { value: '750', unit: 'W', label: 'Motor Power' },
                { value: '90', unit: 'NM', label: 'Peak Torque' },
              ].map(({ value, unit, label }) => (
                <div key={label} className="flex items-start gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-baseline gap-2 justify-end">
                      <span className="text-gray-400 text-xs sm:text-sm tracking-wide">{unit}</span>
                      <span className="font-display text-white text-3xl sm:text-4xl md:text-6xl leading-none">{value}</span>
                    </div>
                    <div className="text-gray-500 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-1 sm:mt-2">{label}</div>
                  </div>
                  <span
                    className="w-6 sm:w-8 h-px mt-3 sm:mt-4 shrink-0"
                    style={{ backgroundColor: BIKES[activeBikeIndex].color }}
                  />
                </div>
              ))}
              <p className="hidden sm:block text-gray-400 text-sm leading-relaxed max-w-xs text-right">
                A direct-drive motor and precision-tuned gearing put every watt straight into
                forward motion — no lag, no wasted power.
              </p>
              <button
                className="hidden sm:block rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide uppercase text-black transition-transform hover:scale-105 w-fit"
                style={{
                  backgroundColor: BIKES[activeBikeIndex].color,
                  boxShadow: `0 0 22px ${BIKES[activeBikeIndex].color}99`,
                }}
              >
                See Drivetrain
              </button>
            </div>
          </Fade>

          {/* Mobile-only condensed copy + CTA, stacked below the two stat columns
              instead of the two separate paragraph/button pairs above, which are
              hidden on small screens to avoid vertical overflow within 100vh. */}
          <Fade from="up" threshold={0.3} className="sm:hidden">
            <div className="absolute left-5 right-5 bottom-[8%] flex flex-col items-center text-center gap-3">
              <p className="text-gray-400 text-xs leading-relaxed">
                Instant torque, real range, and a direct-drive motor built to keep the{' '}
                {BIKES[activeBikeIndex].name} moving when the trail gets serious.
              </p>
              <button
                className="rounded-full px-6 py-2.5 text-xs font-semibold tracking-wide uppercase text-black"
                style={{
                  backgroundColor: BIKES[activeBikeIndex].color,
                  boxShadow: `0 0 22px ${BIKES[activeBikeIndex].color}99`,
                }}
              >
                See Performance
              </button>
            </div>
          </Fade>
        </Section>

        {/* 3. Weight stat */}
        <Section id="weight">
          <Fade from="left">
            <div className="absolute top-[8%] md:top-44 left-5 sm:left-8 md:left-16 flex flex-col gap-3 sm:gap-4 w-32 sm:w-40 md:w-44">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-white/10 bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&q=60"
                  alt="Trail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/10 px-3 sm:px-5 py-3 sm:py-4">
                <div className="text-white text-xl sm:text-3xl font-semibold">32 lbs</div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[9px] sm:text-[10px] tracking-widest uppercase mt-1 sm:mt-2">
                  <BagIcon />
                  Approx. Weight
                </div>
              </div>
            </div>
          </Fade>
          <Fade from="up" threshold={0.3}>
            <span className="absolute bottom-4 sm:bottom-16 left-1/2 -translate-x-1/2 text-gray-400 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
              Adaptable Performance
            </span>
          </Fade>
          <Fade from="right" threshold={0.3}>
            <div className="absolute top-[8%] md:top-44 right-5 sm:right-8 md:right-16 max-w-[45vw] sm:max-w-xs text-right">
              <p className="text-gray-400 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3">
                Featherlight Frame
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                A carbon monocoque shaves every unnecessary gram, so the{' '}
                {BIKES[activeBikeIndex].name} climbs like a hardtail and descends like a downhill
                rig — without the usual weight trade-off.
              </p>
            </div>
          </Fade>
          <Fade from="right" threshold={0.3}>
            <h2 className="font-display absolute bottom-16 sm:bottom-24 right-5 sm:right-8 md:right-16 text-white/70 text-xl sm:text-3xl md:text-4xl text-right leading-relaxed">
              Dominance on Two Wheels
            </h2>
          </Fade>
        </Section>

        {/* 4. Speed stat */}
        <Section id="speed">
          <Fade from="left">
            <div className="absolute top-[8%] md:top-44 left-5 sm:left-8 md:left-16 flex flex-col gap-3 sm:gap-4 w-36 sm:w-40 md:w-44">
              <div className="rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/10 px-3 sm:px-4 py-3 sm:py-4">
                <svg width="100%" height="30" viewBox="0 0 140 36" fill="none">
                  <path
                    d="M4 28 C 30 8, 50 30, 75 14 S 120 6, 136 10"
                    stroke="#c084fc"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="4" cy="28" r="3" fill="#c084fc" />
                  <circle cx="136" cy="10" r="3" fill="#c084fc" />
                </svg>
                <div className="text-gray-400 text-[9px] sm:text-[10px] tracking-widest mt-1 sm:mt-2">
                  03/03/2023 · 10:00 AM
                </div>
              </div>
              <div className="rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/10 px-3 sm:px-5 py-3 sm:py-4">
                <div className="text-white text-xl sm:text-3xl font-semibold">12X</div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[9px] sm:text-[10px] tracking-widest uppercase mt-1 sm:mt-2">
                  <GearIcon />
                  Speed Shifters
                </div>
              </div>
            </div>
          </Fade>
          <Fade from="up" threshold={0.3}>
            <span className="absolute bottom-4 sm:bottom-16 left-1/2 -translate-x-1/2 text-gray-400 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase whitespace-nowrap">
              Aggressive Geometry
            </span>
          </Fade>
          <Fade from="right" threshold={0.3}>
            <h2 className="font-display absolute bottom-16 sm:bottom-24 right-5 sm:right-8 md:right-16 text-white/80 text-xl sm:text-3xl md:text-4xl text-right leading-relaxed">
              Engineered
              <br />
              for the Extreme
            </h2>
          </Fade>
        </Section>

        {/* 5. Transition beat */}
        <Section id="transition" className="overflow-y-auto md:overflow-visible">
          <Fade from="left">
            <div className="absolute top-4 md:top-32 left-5 sm:left-8 md:left-16 max-w-[85vw] sm:max-w-sm">
              <p className="text-gray-400 text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3">
                {BIKES[activeBikeIndex].name} — Under the Hood
              </p>
              <h2 className="font-display text-white text-2xl sm:text-3xl md:text-4xl leading-tight mb-3 sm:mb-4">
                Built From the
                <br />
                Ground Up
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Every tube, pivot, and bearing on the {BIKES[activeBikeIndex].name} is tuned as one
                system — not bolted-on parts, but a frame designed around how it actually rides.
              </p>
              <p className="hidden sm:block text-gray-500 text-sm leading-relaxed mb-6">
                Hydroformed alloy meets a carbon front triangle, wrapped around a geometry
                tested across hundreds of miles of real trail — not just a spec sheet.
              </p>
              <button
                className="rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-white border transition-all hover:bg-white/10"
                style={{
                  borderColor: `${BIKES[activeBikeIndex].color}80`,
                  boxShadow: `0 0 18px ${BIKES[activeBikeIndex].color}55`,
                }}
              >
                Learn More
              </button>
            </div>
          </Fade>

          <Fade from="right">
            <div className="absolute top-[62%] md:top-32 right-5 sm:right-8 md:right-16 w-[85vw] sm:w-64 flex flex-col items-end gap-2 sm:gap-4">
              <div className="w-full rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 p-3 sm:p-5">
                <div className="flex items-center gap-1.5 text-gray-400 text-[9px] sm:text-[10px] tracking-widest uppercase mb-2 sm:mb-4">
                  <GearIcon />
                  Drivetrain Specs
                </div>
                <div className="grid grid-cols-2 gap-y-2 sm:gap-y-4 gap-x-3">
                  {[
                    { value: '12X', label: 'Speed Shifters' },
                    { value: '160mm', label: 'Travel' },
                    { value: '29"', label: 'Wheel Size' },
                    { value: '13.2kg', label: 'Weight' },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div className="text-white text-base sm:text-xl font-semibold">{value}</div>
                      <div className="text-gray-500 text-[8px] sm:text-[9px] tracking-wide uppercase mt-0.5 sm:mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="hidden sm:block text-gray-400 text-xs leading-relaxed text-right">
                Precision-tuned components built to survive every drop, jump, and switchback.
              </p>
              <p className="hidden sm:block text-gray-500 text-xs leading-relaxed text-right">
                Every drivetrain part is sourced, matched, and dialed in-house before the bike
                ever leaves the shop floor.
              </p>
              <button
                className="rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-black transition-transform hover:scale-105"
                style={{
                  backgroundColor: BIKES[activeBikeIndex].color,
                  boxShadow: `0 0 22px ${BIKES[activeBikeIndex].color}99`,
                }}
              >
                View Full Specs
              </button>
            </div>
          </Fade>
        </Section>

        {/* 6. Brand story copy */}
        <Section id="story">
          <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-black/60 blur-3xl opacity-60" />
          <div className="absolute bottom-0 right-0 w-44 h-44 sm:w-72 sm:h-72 rounded-full bg-black/60 blur-3xl opacity-60" />
          <Fade from="left">
            <div className="hidden md:block absolute top-52 left-16 max-w-[380px] text-white space-y-4 text-base leading-relaxed">
              <p className="text-white/90 font-medium">
                the bike built for those who crave the thrill of the ride and
                refuse to compromise on
              </p>
              <p className="text-gray-400">
                performance. With advanced engineering, a rugged frame, and
                aggressive style, Speactra is ready to conquer any terrain and
                every trail. Experience power, precision, and control like
                never before.
              </p>
            </div>
          </Fade>

          <Fade from="right">
            <div className="hidden md:block absolute top-52 right-16 max-w-[380px] text-white space-y-4 text-base leading-relaxed text-right">
              <p className="text-white/90 font-medium">
                backed by a team obsessed with the details
              </p>
              <p className="text-gray-400">
                From frame layup to final torque spec, every {BIKES[activeBikeIndex].name} is
                hand-checked before it ships. Real support, real parts availability, and a
                warranty that actually means something.
              </p>
            </div>
          </Fade>

          {/* Condensed single-column version of the two side blocks above,
              shown only below md where there isn't width for both columns
              plus the centered CTA without overlapping. */}
          <Fade from="up" threshold={0.3} className="md:hidden">
            <div className="absolute top-[10%] left-5 right-5 text-white text-center space-y-3 text-sm leading-relaxed">
              <p className="text-white/90 font-medium">
                Built for those who refuse to compromise on performance.
              </p>
              <p className="text-gray-400 text-xs">
                Every {BIKES[activeBikeIndex].name} is hand-checked before it ships — real
                support, real parts, and a warranty that means something.
              </p>
            </div>
          </Fade>

          <Fade from="up" threshold={0.3} className="w-full h-full">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 px-5 text-center">
              <h3 className="font-display text-white text-xl sm:text-2xl md:text-3xl text-center">
                Ready to <span style={{ color: BIKES[activeBikeIndex].color }}>Ride</span>?
              </h3>
              <button
                className="rounded-full px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-black flex items-center gap-2 transition-transform hover:scale-105"
                style={{ backgroundColor: BIKES[activeBikeIndex].color }}
              >
                Pre-order Now
                <span>→</span>
              </button>
              <p className="text-gray-600 text-[10px] sm:text-xs tracking-widest uppercase mt-1 sm:mt-2">
                © 2026 Speactra — All Rights Reserved
              </p>
            </div>
          </Fade>
        </Section>

      </div>
      </div>
    </>
  );
}
