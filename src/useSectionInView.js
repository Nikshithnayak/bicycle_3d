import { useEffect, useRef, useState } from 'react';

// Tracks whether a section is the "active" one for UI purposes — used to
// fade/slide the HTML overlay cards in and out in sync with scroll,
// independent of the continuous GSAP-driven camera motion.
export function useSectionInView(threshold = 0.5) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
