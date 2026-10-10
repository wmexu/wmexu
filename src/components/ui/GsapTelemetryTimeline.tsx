"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";

export default function GsapTelemetryTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [telemetryValues, setTelemetryValues] = useState({
    flux: 10,
    entropy: 95,
    coherence: 45,
  });

  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const pulseNodeRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      // Build sequenced GSAP timeline
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.5,
        onUpdate: () => {
          // Frame-level scrubbed numerical telemetry simulation
          const progress = tl.progress();
          setTelemetryValues({
            flux: Math.round(10 + progress * 89.4),
            entropy: Math.round(95 - progress * 82.1),
            coherence: Math.round(45 + progress * 54.9),
          });
        },
      });

      timelineRef.current = tl;

      // Stage 1: Circuit Paths reveal
      tl.fromTo(
        ".circuit-node",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)" }
      );

      // Stage 2: Draw SVG paths using strokeDashoffset
      if (path1Ref.current && path2Ref.current) {
        const length1 = path1Ref.current.getTotalLength() || 300;
        const length2 = path2Ref.current.getTotalLength() || 300;

        tl.fromTo(
          path1Ref.current,
          { strokeDasharray: length1, strokeDashoffset: length1 },
          { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
          "-=0.2"
        );

        tl.fromTo(
          path2Ref.current,
          { strokeDasharray: length2, strokeDashoffset: length2 },
          { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
          "<0.2"
        );
      }

      // Stage 3: Pulse Signal along data route
      if (pulseNodeRef.current) {
        tl.fromTo(
          pulseNodeRef.current,
          { scale: 0.8, opacity: 0.4 },
          {
            scale: 1.8,
            opacity: 1,
            duration: 0.8,
            yoyo: true,
            repeat: 2,
            ease: "sine.inOut",
          },
          "-=0.4"
        );
      }

      // Stage 4: Matrix telemetry bar fills
      tl.fromTo(
        ".telemetry-bar",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", transformOrigin: "left" },
        "-=0.6"
      );
    },
    { scope: containerRef }
  );

  const togglePlay = () => {
    if (!timelineRef.current) return;
    if (isPlaying) {
      timelineRef.current.pause();
      setIsPlaying(false);
    } else {
      timelineRef.current.play();
      setIsPlaying(true);
    }
  };

  const restartTimeline = () => {
    if (!timelineRef.current) return;
    timelineRef.current.restart();
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative p-6 rounded-2xl border border-purple-500/30 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_30px_rgba(168,85,247,0.12)] overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <h3 className="font-mono text-sm uppercase tracking-wider text-purple-300 font-semibold">
            GSAP Orchestration // Multi-Phase Scrubbing
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 transition-colors"
            title={isPlaying ? "Pause Timeline" : "Play Timeline"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={restartTimeline}
            className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-300 hover:bg-purple-900/60 transition-colors"
            title="Restart Timeline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Circuit Canvas */}
      <div className="my-6 relative h-36 flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 600 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circuit Paths */}
          <path
            ref={path1Ref}
            d="M 20 60 H 160 L 220 20 H 380 L 440 60 H 580"
            stroke="#a855f7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            ref={path2Ref}
            d="M 60 100 H 200 L 260 100 L 320 60 H 420 L 480 100 H 560"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Circuit Nodes */}
          <circle cx="20" cy="60" r="5" fill="#a855f7" className="circuit-node" />
          <circle cx="160" cy="60" r="5" fill="#a855f7" className="circuit-node" />
          <circle cx="220" cy="20" r="6" fill="#00f0ff" className="circuit-node" />
          <circle
            ref={pulseNodeRef}
            cx="300"
            cy="20"
            r="8"
            fill="#a855f7"
            className="circuit-node"
          />
          <circle cx="380" cy="20" r="6" fill="#00f0ff" className="circuit-node" />
          <circle cx="440" cy="60" r="5" fill="#a855f7" className="circuit-node" />
          <circle cx="580" cy="60" r="6" fill="#10b981" className="circuit-node" />
        </svg>
      </div>

      {/* Telemetry Scrubbed Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3 rounded-lg border border-purple-500/20 bg-black/40">
          <div className="flex justify-between text-zinc-400 mb-1.5">
            <span>FLUX INTENSITY</span>
            <span className="text-purple-400 font-bold">{telemetryValues.flux}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="telemetry-bar h-full bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full"
              style={{ width: `${telemetryValues.flux}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg border border-purple-500/20 bg-black/40">
          <div className="flex justify-between text-zinc-400 mb-1.5">
            <span>ENTROPY LEAK</span>
            <span className="text-cyan-400 font-bold">{telemetryValues.entropy}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="telemetry-bar h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
              style={{ width: `${telemetryValues.entropy}%` }}
            />
          </div>
        </div>

        <div className="p-3 rounded-lg border border-purple-500/20 bg-black/40">
          <div className="flex justify-between text-zinc-400 mb-1.5">
            <span>COHERENCE SYNC</span>
            <span className="text-emerald-400 font-bold">{telemetryValues.coherence}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="telemetry-bar h-full bg-gradient-to-r from-emerald-500 to-purple-400 rounded-full"
              style={{ width: `${telemetryValues.coherence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
