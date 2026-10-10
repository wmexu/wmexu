"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import {
  Terminal,
  Activity,
  Box,
  Layers,
  Sparkles,
  Cpu,
  Search,
  X,
  Compass,
} from "lucide-react";

interface CyberCommandMenuProps {
  onSelectAction?: (action: string) => void;
}

export default function CyberCommandMenu({ onSelectAction }: CyberCommandMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (action: string) => {
    setOpen(false);
    if (onSelectAction) {
      onSelectAction(action);
    }
  };

  return (
    <>
      {/* Trigger Button in Header/HUD */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3.5 py-1.5 rounded-lg border border-cyan-500/30 bg-black/60 hover:bg-cyan-950/40 text-zinc-300 hover:text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,240,255,0.08)] backdrop-blur-md text-xs font-mono group"
      >
        <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">TERMINAL PROTOCOL</span>
        <span className="inline sm:hidden">HUD</span>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-[10px] text-zinc-400">
            Ctrl
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-[10px] text-zinc-400">
            K
          </kbd>
        </div>
      </button>

      {/* CMDK Dialog Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-xl border border-cyan-500/40 bg-zinc-950/95 shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
            {/* Header Accent Glow */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

            <Command className="w-full">
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-800">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <Command.Input
                  placeholder="Execute cyber command or telemetry search..."
                  className="w-full bg-transparent text-sm text-cyan-100 placeholder:text-zinc-600 focus:outline-none font-mono"
                  autoFocus
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2 font-mono text-xs">
                <Command.Empty className="py-6 text-center text-zinc-500">
                  NO MATCHING PROTOCOLS FOUND
                </Command.Empty>

                <Command.Group
                  heading={
                    <span className="px-2 py-1 text-[10px] font-semibold text-cyan-500/80 tracking-widest uppercase">
                      SYSTEM NAVIGATION
                    </span>
                  }
                  className="py-1"
                >
                  <Command.Item
                    onSelect={() => handleSelect("scroll-3d")}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:bg-cyan-950/50 hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Box className="w-4 h-4 text-cyan-400" />
                      <span>R3F Holographic Node</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500">
                      G 1
                    </kbd>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect("scroll-gsap")}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:bg-cyan-950/50 hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span>GSAP Timeline Telemetry</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500">
                      G 2
                    </kbd>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect("scroll-spline")}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:bg-cyan-950/50 hover:text-cyan-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Spline Interactive Runtime</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500">
                      G 3
                    </kbd>
                  </Command.Item>
                </Command.Group>

                <Command.Group
                  heading={
                    <span className="px-2 py-1 text-[10px] font-semibold text-purple-500/80 tracking-widest uppercase">
                      TELEMETRY CONTROLS
                    </span>
                  }
                  className="py-1 mt-2"
                >
                  <Command.Item
                    onSelect={() => handleSelect("recalibrate")}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:bg-purple-950/50 hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span>Recalibrate Quantum Cores</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">READY</span>
                  </Command.Item>

                  <Command.Item
                    onSelect={() => handleSelect("stack-overview")}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:bg-purple-950/50 hover:text-purple-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Audit Active Stack (10/10)</span>
                    </div>
                    <span className="text-[10px] text-cyan-400">ONLINE</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              {/* Footer status bar */}
              <div className="px-4 py-2 border-t border-zinc-900 bg-black/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>WMEXU PROTOCOL // CMDK HUD</span>
                <span className="text-zinc-400">ESC TO CLOSE</span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
