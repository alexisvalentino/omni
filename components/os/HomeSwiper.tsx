'use client';

import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, useMotionValue, animate, PanInfo } from 'framer-motion';
import { useOmniStore } from '../../store/omni';

type Props = {
  leftPage: React.ReactNode;
  centerPage: React.ReactNode;
  rightPage?: React.ReactNode;
};

export default function HomeSwiper({ leftPage, centerPage, rightPage }: Props) {
  const [currentPage, setCurrentPage] = useState(1); // 0=left, 1=center, 2=right
  const containerRef = useRef<HTMLDivElement>(null);
  const maxPage = rightPage ? 2 : 1;
  const x = useMotionValue(0);
  const homeResetTrigger = useOmniStore((s) => s.homeResetTrigger);

  // Reset to center page when home button is pressed
  useEffect(() => {
    if (homeResetTrigger > 0) {
      const w = containerRef.current?.offsetWidth || window.innerWidth || 400;
      setCurrentPage(1);
      animate(x, -w, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      });
    }
  }, [homeResetTrigger, x]);

  // Prevent browser from stealing horizontal swipes (Safari tab switch / history)
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const preventNativeSwipe = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = Math.abs(touchX - startX);
      const diffY = Math.abs(touchY - startY);

      // If swipe is mostly horizontal, prevent default browser action
      if (diffX > diffY) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const elem = containerRef.current;
    if (elem) {
      elem.addEventListener('touchstart', handleTouchStart, { passive: true });
      elem.addEventListener('touchmove', preventNativeSwipe, { passive: false });
      return () => {
        elem.removeEventListener('touchstart', handleTouchStart);
        elem.removeEventListener('touchmove', preventNativeSwipe);
      };
    }
  }, []);

  // Get container width (viewport width)
  const getWidth = () => containerRef.current?.offsetWidth || window.innerWidth || 400;

  // On mount, immediately jump to center page (no animation)
  useLayoutEffect(() => {
    const w = getWidth();
    x.set(-w);
  }, [x]);

  // Snap to a page
  const snapTo = (page: number) => {
    const w = getWidth();
    const target = -page * w;
    setCurrentPage(page);
    animate(x, target, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    });
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const w = getWidth();
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine direction and whether to switch page
    const threshold = w * 0.2; // 20% of screen width
    const velocityThreshold = 300;

    let newPage = currentPage;

    if (offset > threshold || velocity > velocityThreshold) {
      // Swiped right — go to previous page
      newPage = Math.max(0, currentPage - 1);
    } else if (offset < -threshold || velocity < -velocityThreshold) {
      // Swiped left — go to next page
      newPage = Math.min(maxPage, currentPage + 1);
    }

    snapTo(newPage);
  };


  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {/* Two-page horizontal strip */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -maxPage * getWidth(), right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        style={{
          x,
          display: 'flex',
          width: `${(maxPage + 1) * 100}%`,
          height: '100%',
          cursor: 'grab',
          touchAction: 'pan-y',
        }}
      >
        {/* Page 0 — Suggestions (left) */}
        <div style={{ width: `${100 / (maxPage + 1)}%`, height: '100%', flexShrink: 0, position: 'relative' }}>
          {leftPage}
        </div>

        {/* Page 1 — Home (center, default) */}
        <div style={{ width: `${100 / (maxPage + 1)}%`, height: '100%', flexShrink: 0, position: 'relative' }}>
          {centerPage}
        </div>

        {/* Page 2 — App Library (right) */}
        {rightPage && (
          <div style={{ width: `${100 / (maxPage + 1)}%`, height: '100%', flexShrink: 0, position: 'relative' }}>
            {rightPage}
          </div>
        )}
      </motion.div>

      {/* Page indicator dots */}
      <div style={{
        position: 'absolute',
        bottom: 72,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 6,
        zIndex: 10,
      }}>
        {(rightPage ? [0, 1, 2] : [0, 1]).map((i) => (
          <motion.div
            key={i}
            onClick={() => snapTo(i)}
            style={{
              width: currentPage === i ? 18 : 6,
              height: 6,
              borderRadius: 3,
              background: currentPage === i ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
              cursor: 'pointer',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
