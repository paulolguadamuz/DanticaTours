"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, RefObject } from "react";

interface MagneticConfig {
  strength?: number;
  damping?: number;
  stiffness?: number;
}

export function useMagneticHover(
  ref: RefObject<HTMLElement | null>,
  config: MagneticConfig = {}
) {
  const { strength = 0.35, damping = 20, stiffness = 150 } = config;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping, stiffness });
  const springY = useSpring(y, { damping, stiffness });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      x.set(deltaX);
      y.set(deltaY);
    },
    [ref, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    springX,
    springY,
    handleMouseMove,
    handleMouseLeave,
  };
}
