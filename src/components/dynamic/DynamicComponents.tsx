"use client";

import dynamic from "next/dynamic";
import React from "react";

export const DynamicCyber3DScene = dynamic(
  () => import("@/components/canvas/Cyber3DScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_15px_rgba(0,240,255,0.4)]" />
        <span className="mt-3 font-mono text-xs text-cyan-400 tracking-widest animate-pulse">
          INITIALIZING WEBGL VIEWPORT...
        </span>
      </div>
    ),
  }
);

export const DynamicCyberParticles = dynamic(
  () => import("@/components/particles/CyberParticles"),
  {
    ssr: false,
  }
);

export const DynamicSplinePreview = dynamic(
  () => import("@/components/spline/SplinePreview"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-black/60">
        <div className="w-8 h-8 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
        <span className="mt-2 font-mono text-xs text-purple-400">
          LOADING SPLINE RUNTIME...
        </span>
      </div>
    ),
  }
);
