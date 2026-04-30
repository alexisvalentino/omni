'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, useMotionValue, animate, PanInfo } from 'framer-motion';

type Props = {
  leftPage: React.ReactNode;
  centerPage: React.ReactNode;
  rightPage: React.ReactNode;
};

export default function HomeSwiper({ leftPage, centerPage, rightPage }: Props) {
  const [currentPage, setCurrentPage] = useState(1); // 0=left, 1=center, 2=right
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

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
      newPage = Math.min(2, currentPage + 1);
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
      {/* Three-page horizontal strip */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -2 * getWidth(), right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        style={{
          x,
          display: 'flex',
          width: '300%',
          height: '100%',
          cursor: 'grab',
        }}
      >
        {/* Page 0 — Suggestions (left) */}
        <div style={{ width: '33.333%', height: '100%', flexShrink: 0, position: 'relative' }}>
          {leftPage}
        </div>

        {/* Page 1 — Home (center, default) */}
        <div style={{ width: '33.333%', height: '100%', flexShrink: 0, position: 'relative' }}>
          {centerPage}
        </div>

        {/* Page 2 — App Library (right) */}
        <div style={{ width: '33.333%', height: '100%', flexShrink: 0, position: 'relative' }}>
          {rightPage}
        </div>
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
        {[0, 1, 2].map((i) => (
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
