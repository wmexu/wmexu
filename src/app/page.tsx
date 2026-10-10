"use client";

import React from "react";
import { DynamicCyberParticles } from "@/components/dynamic/DynamicComponents";
import HeroTriangle from "@/components/ui/HeroTriangle";
import BrandLogos from "@/components/ui/BrandLogos";
import RecentlyShipped from "@/components/ui/RecentlyShipped";
import BuiltByAgentsAndFooter from "@/components/ui/BuiltByAgentsAndFooter";
import Navbar from "@/components/ui/Navbar";
import RotatingPillarTicker from "@/components/ui/RotatingPillarTicker";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-[#000000] text-[#ededed] selection:bg-white/20 selection:text-white">
      {/* Subtle starfield particles that connect on hover (z-0, pointer-events-none) */}
      <DynamicCyberParticles />

      {/* Extremely faint black-gray grid that almost mixes up with #000000 */}
      <div className="fixed inset-0 faint-grid pointer-events-none z-0 opacity-80" />

      {/* UNIFIED TOP NAVBAR: Root-level z-[100] - never eclipsed by any section or bento card */}
      <Navbar />

      {/* FIRST FULL-VIEWPORT SCREEN (Minus header): Centered Hero, Brand Logos */}
      <div className="relative min-h-[calc(100dvh-125px)] w-full flex flex-col justify-between z-10">
        {/* MIDDLE HERO: DESKTOP (Split with Center Triangle) vs MOBILE (Vertical Stack matching Screenshots 2 & 3) */}
        <section className="flex-1 flex items-center justify-center relative w-full my-auto py-6 sm:py-10">
          {/* DESKTOP LAYOUT (lg:) */}
          <div className="hidden lg:flex relative w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 items-center">
            {/* Centered Glowing Triangle: Exact Width 50% and Height 50% Dead Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none z-10">
              <HeroTriangle />
            </div>

            {/* Two-Column Balanced Grid */}
            <div className="w-full grid grid-cols-2 gap-8 items-center relative z-20">
              {/* Left Column: Heading & Action Buttons */}
              <div className="flex flex-col justify-center max-w-[530px]">
                <h1
                  className="text-white text-balance mb-8"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "clamp(46px, 4.8vw, 70px)",
                    lineHeight: "clamp(48px, 4.8vw, 70px)",
                    letterSpacing: "-4.2px",
                    fontWeight: 400,
                  }}
                >
                  wmexu.xyz
                  <br />
                  app developer
                </h1>

                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/wmexu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-geist inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black text-sm sm:text-base font-normal hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    Me on Github
                  </a>
                  <a
                    href="https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-geist inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-950/80 border border-white/[0.14] hover:border-white/[0.28] text-zinc-300 hover:text-white text-sm sm:text-base font-normal transition-colors"
                  >
                    Order app
                  </a>
                </div>
              </div>

              {/* Right Column: Key Pillars, aligned to right edge */}
              <div className="flex flex-col justify-center items-end">
                <div className="text-[16.5px] sm:text-[18px] text-zinc-400 font-normal leading-[2.45] max-w-[310px]">
                  <p className="hover:text-white transition-colors cursor-default">
                    Engineered end-to-end
                  </p>
                  <p className="hover:text-white transition-colors cursor-default">
                    Optimized for speed & conversion
                  </p>
                  <p className="hover:text-white transition-colors cursor-default">
                    Clean, maintainable code
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT (< lg): Centered vertical stack */}
          <div className="flex lg:hidden flex-col items-center text-center w-full max-w-md mx-auto px-6 py-4">
            {/* 1. Centered Glowing Triangle at Top */}
            <div className="mb-4">
              <HeroTriangle />
            </div>

            {/* 2. Centered Heading (wmexu.xyz app developer) */}
            <h1
              className="text-white text-balance tracking-tight mb-3"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "clamp(38px, 10vw, 46px)",
                lineHeight: "1.05",
                letterSpacing: "-2.6px",
                fontWeight: 400,
              }}
            >
              wmexu.xyz
              <br />
              app developer
            </h1>

            {/* 3. Rotating Subtitle Ticker (Monospace) */}
            <div className="mb-6">
              <RotatingPillarTicker />
            </div>

            {/* 4. Full-Width Stacked CTA Buttons */}
            <div className="w-full flex flex-col gap-3">
              <a
                href="https://github.com/wmexu"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-geist w-full py-3.5 rounded-full bg-white text-black text-sm font-normal text-center hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Me on Github
              </a>
              <a
                href="https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-geist w-full py-3.5 rounded-full bg-zinc-950 border border-white/[0.14] hover:border-white/[0.28] text-white text-sm font-normal text-center transition-colors"
              >
                Order app
              </a>
            </div>
          </div>
        </section>

        {/* BOTTOM: Brand Logos Pinned to Bottom of First Viewport */}
        <div className="w-full shrink-0">
          <BrandLogos />
        </div>
      </div>

      {/* SECTION 2 (BELOW THE FOLD): Only visible on scrolling down */}
      <main className="relative z-10 w-full">
        {/* Recently Shipped Bento Grid */}
        <RecentlyShipped />

        {/* Built by you, or your agents & Multi-Column Footer */}
        <BuiltByAgentsAndFooter />
      </main>
    </div>
  );
}
