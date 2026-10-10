"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";

export default function CyberParticles() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkViewport);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  const initEngine = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particleOptions = useMemo<ISourceOptions>(() => {
    const particleCount = isMobile ? 35 : 75;

    return {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: !reducedMotion,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 160,
            links: {
              opacity: 0.28,
              color: "#ffffff",
            },
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 120,
          enable: true,
          opacity: 0.05,
          width: 0.75,
        },
        move: {
          direction: "none",
          enable: !reducedMotion,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.25,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: particleCount,
        },
        opacity: {
          value: { min: 0.08, max: 0.22 },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 0.8, max: 1.5 },
        },
      },
      detectRetina: true,
    };
  }, [isMobile, reducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <ParticlesProvider init={initEngine}>
        <Particles
          id="tsparticles-stars"
          options={particleOptions}
          className="w-full h-full pointer-events-none"
        />
      </ParticlesProvider>
    </div>
  );
}
