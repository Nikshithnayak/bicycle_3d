import { useEffect, useState } from 'react';

const LINKS = ['Home', 'Bikes', 'Technology', 'About', 'Support'];

function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export default function Navbar({ accentColor = '#22c55e' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on resize past the mobile breakpoint so it can't
  // get stuck open behind the desktop nav.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-5 transition-colors duration-500 ${
        scrolled || menuOpen ? 'backdrop-blur-md bg-black/30' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-1.5 text-white font-normal tracking-[0.1em] md:tracking-[0.15em] text-base md:text-lg font-display shrink-0">
        <span className="text-[10px] align-super">&apos;</span>
        SPEACTRA
      </div>

      <div className="hidden md:flex items-center gap-8">
        {LINKS.map((label, i) => (
          <button
            key={label}
            className={`text-sm transition-colors relative pb-1 ${
              i === 0 ? '' : 'text-gray-300 hover:text-white'
            }`}
            style={i === 0 ? { color: accentColor } : undefined}
          >
            {label}
            {i === 0 && (
              <span
                className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="rounded-full border px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-colors hover:bg-white/5 shrink-0"
          style={{ borderColor: `${accentColor}66`, color: accentColor }}
        >
          <span className="hidden sm:inline">Pre-order Now</span>
          <span className="sm:hidden">Pre-order</span>
          <span>→</span>
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white shrink-0"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 flex flex-col px-4 py-3">
          {LINKS.map((label, i) => (
            <button
              key={label}
              onClick={() => setMenuOpen(false)}
              className="text-left text-sm py-3 border-b border-white/5 last:border-none"
              style={i === 0 ? { color: accentColor } : { color: '#d1d5db' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
