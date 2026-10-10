"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Box,
  Layers,
  Cpu,
  Zap,
  Terminal,
  Activity,
  Compass,
  Monitor,
  Code2,
  ExternalLink,
} from "lucide-react";

interface StackItem {
  id: string;
  name: string;
  category: "3d" | "physics" | "hud";
  pkg: string;
  role: string;
  status: string;
  badge: string;
}

const STACK_ITEMS: StackItem[] = [
  {
    id: "motion",
    name: "Motion",
    category: "physics",
    pkg: "motion",
    role: "Spring physics, layoutId transitions, and gesture interactions",
    status: "ACTIVE",
    badge: "CORE UI",
  },
  {
    id: "r3f",
    name: "React Three Fiber",
    category: "3d",
    pkg: "@react-three/fiber",
    role: "Declarative Three.js viewport & procedural WebGL meshes",
    status: "READY",
    badge: "3D CANVAS",
  },
  {
    id: "drei",
    name: "React Three Drei",
    category: "3d",
    pkg: "@react-three/drei",
    role: "3D helpers, Float primitives, Distort materials & HTML HUD",
    status: "READY",
    badge: "3D PRESETS",
  },
  {
    id: "postprocessing",
    name: "R3F Postprocessing",
    category: "3d",
    pkg: "@react-three/postprocessing",
    role: "Sci-fi Bloom, chromatic aberration, scanlines & vignettes",
    status: "STANDBY",
    badge: "SHADERS",
  },
  {
    id: "gsap",
    name: "GSAP & GSAP React",
    category: "physics",
    pkg: "gsap, @gsap/react",
    role: "Scoped timeline orchestration & frame-level scrub controls",
    status: "SYNCED",
    badge: "TIMELINE",
  },
  {
    id: "lenis",
    name: "Lenis Inertia",
    category: "physics",
    pkg: "lenis",
    role: "Smooth inertia momentum scroll engine for Next.js App Router",
    status: "RUNNING",
    badge: "SCROLL",
  },
  {
    id: "spline",
    name: "Spline Runtime",
    category: "3d",
    pkg: "@splinetool/react-spline",
    role: "Interactive 3D scenes with physics and cursor tracking",
    status: "LOADED",
    badge: "ASSETS",
  },
  {
    id: "cmdk",
    name: "CMDK Command HUD",
    category: "hud",
    pkg: "cmdk",
    role: "Futuristic keyboard-first command palette with glassmorphism",
    status: "LISTENING",
    badge: "PALETTE",
  },
  {
    id: "particles",
    name: "TSParticles",
    category: "physics",
    pkg: "@tsparticles/react, @tsparticles/slim",
    role: "Ambient cyber constellations, particles grid & data dust",
    status: "ENGAGED",
    badge: "PARTICLES",
  },
  {
    id: "scramble",
    name: "React Scramble",
    category: "hud",
    pkg: "react-scramble",
    role: "Cyberpunk text decode and terminal telemetry scramble",
    status: "ONLINE",
    badge: "TELEMETRY",
  },
];

export default function MotionStackShowcase() {
  const [activeCategory, setActiveCategory] = useState<"all" | "3d" | "physics" | "hud">("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredItems = STACK_ITEMS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Category Tabs using motion layoutId */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-xl border border-cyan-500/20 bg-zinc-950/60 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          {(["all", "3d", "physics", "hud"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors z-10 ${
                activeCategory === cat ? "text-cyan-300 font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 rounded-lg bg-cyan-950/70 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {cat === "all" ? "All Protocols (10)" : cat === "3d" ? "3D Engine" : cat === "physics" ? "Physics & Motion" : "HUD & Telemetry"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 font-mono text-[11px] text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ALL 10 LIBRARIES BOUND & OPERATIONAL</span>
        </div>
      </div>

      {/* Cards Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredCard(item.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative p-5 rounded-xl border border-zinc-800 hover:border-cyan-500/50 bg-zinc-950/70 hover:bg-zinc-900/50 backdrop-blur-md transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group overflow-hidden"
            >
              {/* Corner Sci-Fi Accents */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/50" />
              </div>

              {/* Glowing gradient aura on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 transition-opacity duration-300 pointer-events-none ${
                  hoveredCard === item.id ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="flex items-start justify-between mb-3 relative z-10">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    {item.badge}
                  </span>
                  <h4 className="mt-2 text-base font-semibold text-zinc-100 group-hover:text-cyan-200 transition-colors">
                    {item.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px] relative z-10 mb-4">
                {item.role}
              </p>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[11px] text-zinc-500 relative z-10">
                <code className="text-cyan-400/80 bg-black/40 px-2 py-0.5 rounded border border-cyan-950">
                  {item.pkg}
                </code>
                <span className="group-hover:text-cyan-400 transition-colors">READY &rarr;</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
