"use client";

import { ReactLenis } from "lenis/react";
import React, { ReactNode } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: true,
        syncTouchLerp: 0.055,       // Low damping = continuous smooth coasting, no premature 0.2s braking
        touchInertiaExponent: 1.75, // Rich, generous glide momentum (matching PC scroll scale)
        touchMultiplier: 1.05,      // Exact normal 1:1 speed when moving finger
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}

