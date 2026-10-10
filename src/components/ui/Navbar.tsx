"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import LiquidGlassLogo from "./LiquidGlassLogo";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(41);
  const [drawerTop, setDrawerTop] = useState(121);
  const [activeSection, setActiveSection] = useState<"app" | "skills" | "discuss">("app");
  const bannerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const { scrollY } = useScroll();

  // Scroll sync: Translate the navbar container upwards by max(bannerHeight).
  // When at the top (scrollY = 0), y = 0 (banner visible).
  // When scrolling down, banner scrolls up out of view in sync with the page.
  // When scrollY >= bannerHeight, y = -bannerHeight, locking the header (w. + burger) fixed at top: 0!
  const navTranslateY = useTransform(scrollY, (y) => {
    return -Math.min(y, bannerHeight);
  });

  // Measure banner height and drawer anchor
  useEffect(() => {
    const updateDimensions = () => {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.offsetHeight);
      }
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setDrawerTop(rect ? Math.max(80, rect.bottom) : 80);
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("scroll", updateDimensions, { passive: true });
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("scroll", updateDimensions);
    };
  }, []);

  // Real-time active section tracking on scroll (App, Skills, Discuss)
  useEffect(() => {
    const updateActiveSection = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Bottom of page check
      if (currentScrollY + windowHeight >= docHeight - 100) {
        setActiveSection("discuss");
        return;
      }

      const skillsEl = document.getElementById("skills");
      const discussEl = document.getElementById("discuss");

      const threshold = 220; // px from top of viewport taking fixed header into account

      if (discussEl) {
        const discussTop = discussEl.getBoundingClientRect().top;
        if (discussTop <= threshold) {
          setActiveSection("discuss");
          return;
        }
      }

      if (skillsEl) {
        const skillsTop = skillsEl.getBoundingClientRect().top;
        if (skillsTop <= threshold) {
          setActiveSection("skills");
          return;
        }
      }

      setActiveSection("app");
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  // Smooth scroll helper using curved Lenis easing with offset accounting for fixed header
  const scrollTo = (target: string | number) => {
    if (target === 0) {
      setActiveSection("app");
    } else if (target === "#skills") {
      setActiveSection("skills");
    } else if (target === "#discuss") {
      setActiveSection("discuss");
    }

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
          offset: typeof target === "number" ? 0 : -80,
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

  // Toggle mobile menu and capture exact current header bottom
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const willOpen = !prev;
      if (willOpen && headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setDrawerTop(rect ? Math.max(80, rect.bottom) : 80);
      }
      return willOpen;
    });
  };

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
    <div className="w-full shrink-0 relative z-[100]">
      {/* Spacer to preserve normal document flow so hero content isn't obscured on initial spawn */}
      <div
        style={{ height: `${bannerHeight + 80}px` }}
        className="w-full shrink-0 pointer-events-none"
      />

      {/* Fixed Navigation bar translating up by max(bannerHeight) on scroll */}
      <motion.div
        style={{ y: navTranslateY }}
        className="fixed top-0 inset-x-0 z-[100] w-full flex flex-col pointer-events-auto"
      >
        {/* Top Banner: Available for new projects • Get in touch [arrow] */}
        <div
          ref={bannerRef}
          className="w-full py-2.5 px-4 text-center border-b border-white/[0.04] bg-black/80 backdrop-blur-md text-xs sm:text-sm font-normal shrink-0"
        >
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

        {/* Main Header Bar (w. + Navigators / Burger) */}
        <header
          ref={headerRef}
          data-lenis-prevent="true"
          data-lenis-prevent-touch="true"
          style={{ touchAction: "none" }}
          className="w-full bg-[#000000]/90 backdrop-blur-3xl border-b border-white/[0.06] transition-colors duration-200 shrink-0 h-20 select-none"
        >
          <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
            {/* Left: w. logo + Navigators */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => scrollTo(0)}
                data-lenis-prevent="true"
                data-lenis-prevent-touch="true"
                style={{ touchAction: "none" }}
                className="inline-flex items-center justify-center select-none translate-y-[1px] cursor-pointer"
                aria-label="Home"
              >
                <LiquidGlassLogo text="w." fontSize={28} />
              </button>

              {/* Desktop Navigators (App, Skills, Discuss) with live active section indicator */}
              <nav className="hidden lg:flex items-center gap-8 text-[15px] sm:text-base font-normal">
                <button
                  onClick={() => scrollTo(0)}
                  className={`transition-colors select-none cursor-pointer ${
                    activeSection === "app"
                      ? "text-white font-medium-450"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  App
                </button>
                <button
                  onClick={() => scrollTo("#skills")}
                  className={`transition-colors select-none cursor-pointer ${
                    activeSection === "skills"
                      ? "text-white font-medium-450"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Skills
                </button>
                <button
                  onClick={() => scrollTo("#discuss")}
                  className={`transition-colors select-none cursor-pointer ${
                    activeSection === "discuss"
                      ? "text-white font-medium-450"
                      : "text-zinc-400 hover:text-white"
                  }`}
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
              onClick={toggleMobileMenu}
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
      </motion.div>

      {/* Mobile Menu Panel: Translucent Matte Glass iPhone Liquid Effect (outside transformed motion.div so fixed coordinates are true viewport-relative) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            data-lenis-prevent="true"
            className="lg:hidden fixed inset-x-0 bottom-0 z-[90] flex flex-col justify-between p-6 sm:p-8 iphone-matte-glass overflow-y-auto allow-drawer-scroll overscroll-contain pointer-events-auto"
            style={{
              top: `${drawerTop}px`,
              background: "linear-gradient(180deg, rgba(14, 14, 14, 0.78) 0%, rgba(6, 6, 6, 0.84) 100%)",
              backdropFilter: "blur(36px) saturate(190%) contrast(105%)",
              WebkitBackdropFilter: "blur(36px) saturate(190%) contrast(105%)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.12), inset 0 0 30px rgba(255, 255, 255, 0.02)",
            }}
          >
            {/* Menu Links with live active indicator */}
            <div className="flex flex-col gap-6 pt-4">
              <button
                onClick={() => scrollTo(0)}
                className={`flex items-center justify-between text-2xl font-normal transition-colors text-left cursor-pointer ${
                  activeSection === "app"
                    ? "text-white font-medium-450"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>App</span>
                <ChevronRight className={`w-5 h-5 transition-colors ${activeSection === "app" ? "text-white" : "text-zinc-500"}`} />
              </button>

              <button
                onClick={() => scrollTo("#skills")}
                className={`flex items-center justify-between text-2xl font-normal transition-colors text-left cursor-pointer ${
                  activeSection === "skills"
                    ? "text-white font-medium-450"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Skills</span>
                <ChevronRight className={`w-5 h-5 transition-colors ${activeSection === "skills" ? "text-white" : "text-zinc-500"}`} />
              </button>

              <button
                onClick={() => scrollTo("#discuss")}
                className={`flex items-center justify-between text-2xl font-normal transition-colors text-left cursor-pointer ${
                  activeSection === "discuss"
                    ? "text-white font-medium-450"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Discuss</span>
                <ChevronRight className={`w-5 h-5 transition-colors ${activeSection === "discuss" ? "text-white" : "text-zinc-500"}`} />
              </button>
            </div>

            {/* Bottom Stacked Buttons */}
            <div className="flex flex-col gap-3.5 pt-8 pb-8">
              <a
                href="https://github.com/wmexu"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-geist w-full py-3.5 rounded-lg border border-white/[0.14] hover:border-white/[0.28] bg-zinc-950/80 text-white text-sm font-normal text-center transition-colors inline-flex items-center justify-center gap-2 select-none"
              >
                <SiGithub className="w-4 h-4 text-white shrink-0 -translate-y-[1px]" color="currentColor" />
                <span>Github</span>
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
