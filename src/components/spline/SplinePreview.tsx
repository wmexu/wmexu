"use client";

import React, { useState } from "react";
import Spline from "@splinetool/react-spline";

interface SplinePreviewProps {
  sceneUrl?: string;
  title?: string;
}

export default function SplinePreview({
  sceneUrl = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
  title = "Spline Neural Core",
}: SplinePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-xl">
      {/* Cyber HUD Header */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-3 border-b border-cyan-500/20 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-300 font-semibold">
            {title}
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
          SPLINE_RUNTIME_V2 // 3D INTERACTION
        </span>
      </div>

      {/* Lightweight SVG Cyber Placeholder while loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80">
          <svg
            className="w-24 h-24 text-cyan-400 animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="60 190"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="40 140"
              strokeLinecap="round"
            />
            <polygon
              points="50,38 60,56 40,56"
              fill="rgba(0, 240, 255, 0.4)"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />
          </svg>
          <p className="mt-4 font-mono text-xs text-cyan-400 tracking-wider animate-pulse">
            STREAMING .SPLINECODE GEOMETRY...
          </p>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-950/50 border border-purple-500/40 flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h4 className="text-zinc-200 font-mono text-sm font-semibold">
            SPLINE ASSET FALLBACK MODE
          </h4>
          <p className="text-zinc-400 text-xs mt-1 max-w-sm">
            Interactive canvas standby. Connect any custom Spline export URL to render runtime geometries.
          </p>
        </div>
      ) : (
        <div className="w-full h-full pt-10">
          <Spline
            scene={sceneUrl}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
