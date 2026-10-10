"use client";

import { ReactLenis, useLenis } from "lenis/react";
import React, { ReactNode, useEffect } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function CurvedTouchGlider() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onTouchStart = () => {
      if (lenis.isScrolling === "smooth") {
        lenis.scrollTo(lenis.scroll, { immediate: true });
      }
    };

    const onTouchEnd = () => {
      const v = lenis.velocity;
      // Trigger smooth curved glide on intentional flick gestures
      if (Math.abs(v) > 0.8) {
        // Natural, restrained glide distance matching PC wheel scale (max 480px)
        const glideDistance =
          Math.sign(v) * Math.min(480, Math.pow(Math.abs(v), 1.42));
        const target = Math.max(
          0,
          Math.min(lenis.limit, lenis.scroll + glideDistance)
        );

        // Uses the EXACT curved speed gliding as PC!
        lenis.scrollTo(target, {
          duration: 1.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [lenis]);

  return null;
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
        syncTouchLerp: 0.08,
        touchInertiaExponent: 1.4,
        touchMultiplier: 1.0, // Normal 1:1 speed when moving finger (NOT turbo boosted!)
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <CurvedTouchGlider />
      {children}
    </ReactLenis>
  );
}

