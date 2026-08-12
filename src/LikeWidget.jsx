import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function LikeWidget() {
  const [count, setCount] = useState(917);
  const heartRef = useRef(null);

  const handleClick = () => {
    setCount((c) => c + 1);
    gsap.fromTo(
      heartRef.current,
      { scale: 1 },
      { scale: 1.3, duration: 0.2, ease: 'back.out(3)', yoyo: true, repeat: 1 }
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-20 flex flex-col items-center gap-1 sm:gap-2">
      <button
        ref={heartRef}
        onClick={handleClick}
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ backgroundColor: '#e8383d' }}
        aria-label="Like"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="sm:w-[22px] sm:h-[22px]">
          <path d="M12 21s-6.7-4.35-9.3-8.1C.6 9.9 1.4 6.3 4.4 5A5.4 5.4 0 0 1 12 7.3 5.4 5.4 0 0 1 19.6 5c3 1.3 3.8 4.9 1.7 7.9C18.7 16.65 12 21 12 21z" />
        </svg>
      </button>
      <span className="text-white font-bold text-xs sm:text-sm">{count}</span>
    </div>
  );
}
