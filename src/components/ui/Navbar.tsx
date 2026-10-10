"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import LiquidGlassLogo from "./LiquidGlassLogo";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(120);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Smooth scroll helper using curved Lenis easing
  const scrollTo = (target: string | number) => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      lenis?.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        } else {
          document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 40);
  };

  // Measure navbar height accurately to anchor drawer seamlessly
  useEffect(() => {
    const updateNavHeight = () => {
      if (navContainerRef.current) {
        setNavHeight(navContainerRef.current.offsetHeight);
      }
    };
    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);

  // Complete background scroll-lock when mobile menu is open (Lenis + DOM + Touch)
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Pause Lenis smooth scrolling
      lenis?.stop();

      // Lock DOM overflow
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      // Prevent touchmove propagation to background page
      const handleTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target?.closest?.(".allow-drawer-scroll")) {
          e.preventDefault();
        }
      };

      window.addEventListener("touchmove", handleTouchMove, { passive: false });

      return () => {
        lenis?.start();
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        window.removeEventListener("touchmove", handleTouchMove);
      };
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [isMobileMenuOpen, lenis]);

  return (
    <div ref={navContainerRef} className="w-full shrink-0 relative z-[100]">
      {/* Top Banner: Available for new projects • Get in touch [arrow] */}
      <div className="w-full py-2.5 px-4 text-center border-b border-white/[0.04] bg-black/60 backdrop-blur-md text-xs sm:text-sm font-normal">
        <a
          href="https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <span>Available for new projects</span>
          <span className="text-zinc-600 font-normal select-none">•</span>
          <span className="text-zinc-200 font-medium-450 inline-flex items-center">
            Get in touch <ChevronRight className="w-3.5 h-3.5 ml-0.5 inline" />
          </span>
        </a>
      </div>

      {/* Main Header Bar */}
      <header className="w-full bg-[#000000]/90 backdrop-blur-3xl border-b border-white/[0.06] transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Left: w. logo + Navigators */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollTo(0)}
              className="inline-flex items-center justify-center select-none translate-y-[1px] cursor-pointer"
              aria-label="Home"
            >
              <LiquidGlassLogo text="w." fontSize={28} />
            </button>

            {/* Desktop Navigators (App, Skills, Discuss) */}
            <nav className="hidden lg:flex items-center gap-8 text-[15px] sm:text-base text-zinc-400 font-normal">
              <button
                onClick={() => scrollTo(0)}
                className="hover:text-white transition-colors select-none"
              >
                App
              </button>
              <button
                onClick={() => scrollTo("#skills")}
                className="hover:text-white transition-colors select-none"
              >
                Skills
              </button>
              <button
                onClick={() => scrollTo("#discuss")}
                className="hover:text-white transition-colors select-none"
              >
                Discuss
              </button>
            </nav>
          </div>

          {/* Right Desktop: Github & Contact */}
          <div className="hidden lg:flex items-center gap-3 text-[15px] sm:text-base">
            <a
              href="https://github.com/wmexu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-geist inline-flex items-center justify-center px-4 py-2 rounded-md border border-white/[0.14] hover:border-white/[0.3] text-zinc-300 hover:text-white text-xs sm:text-sm transition-colors"
            >
              Github
            </a>
            <a
              href="https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-geist inline-flex items-center justify-center px-4 py-2 rounded-md bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-medium-450 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Right Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 text-white hover:text-zinc-300 transition-colors focus:outline-none flex items-center justify-center"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[1.8]" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 stroke-white"
                strokeWidth="1.6"
                strokeLinecap="round"
              >
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="15" x2="20" y2="15" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel: Translucent Matte Glass iPhone Liquid Effect */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            data-lenis-prevent="true"
            className="lg:hidden fixed inset-x-0 bottom-0 z-[100] flex flex-col justify-between p-6 sm:p-8 iphone-matte-glass overflow-y-auto allow-drawer-scroll overscroll-contain"
            style={{
              top: `${navHeight}px`,
              background: "linear-gradient(180deg, rgba(14, 14, 14, 0.78) 0%, rgba(6, 6, 6, 0.84) 100%)",
              backdropFilter: "blur(36px) saturate(190%) contrast(105%)",
              WebkitBackdropFilter: "blur(36px) saturate(190%) contrast(105%)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), inset 0 0 30px rgba(255, 255, 255, 0.02)",
            }}
          >
            {/* Menu Links */}
            <div className="flex flex-col gap-6 pt-4">
              <button
                onClick={() => scrollTo(0)}
                className="flex items-center justify-between text-2xl text-zinc-300 hover:text-white font-normal transition-colors text-left"
              >
                <span>App</span>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>

              <button
                onClick={() => scrollTo("#skills")}
                className="flex items-center justify-between text-2xl text-zinc-300 hover:text-white font-normal transition-colors text-left"
              >
                <span>Skills</span>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>

              <button
                onClick={() => scrollTo("#discuss")}
                className="flex items-center justify-between text-2xl text-zinc-300 hover:text-white font-normal transition-colors text-left"
              >
                <span>Discuss</span>
                <ChevronRight className="w-5 h-5 text-zinc-500" />
              </button>
            </div>

            {/* Bottom Stacked Buttons */}
            <div className="flex flex-col gap-3.5 pt-8 pb-8">
              <a
                href="https://github.com/wmexu"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-geist w-full py-3.5 rounded-lg border border-white/[0.14] hover:border-white/[0.28] bg-zinc-950/80 text-white text-sm font-normal text-center transition-colors inline-block"
              >
                Github
              </a>

              <a
                href="https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-geist w-full py-3.5 rounded-lg bg-white text-black text-sm font-normal text-center hover:bg-zinc-200 transition-colors shadow-sm inline-block"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
