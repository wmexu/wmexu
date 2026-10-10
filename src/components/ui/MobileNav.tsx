"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      {/* 2-line Hamburger Toggle matching Screenshot 2 & 3 */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-white hover:text-zinc-300 transition-colors focus:outline-none"
        aria-label="Open mobile menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-white"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
        </svg>
      </button>

      {/* Full-screen Mobile Menu Drawer matching Screenshot 1 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#000000] flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Top Bar with Logo and Close X */}
            <div className="flex items-center justify-between">
              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center"
                aria-label="Home"
              >
                <svg viewBox="0 0 24 20" className="w-6 h-5.5 fill-white">
                  <polygon points="12,2 23,19 1,19" />
                </svg>
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white hover:text-zinc-400 transition-colors focus:outline-none"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-6 pt-10">
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-2xl text-zinc-300 hover:text-white font-normal transition-colors text-left"
              >
                <span>Products</span>
                <ChevronDown className="w-5 h-5 text-zinc-500" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-2xl text-zinc-300 hover:text-white font-normal transition-colors text-left"
              >
                <span>Resources</span>
                <ChevronDown className="w-5 h-5 text-zinc-500" />
              </button>

              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-zinc-300 hover:text-white font-normal transition-colors"
              >
                Enterprise
              </a>

              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-zinc-300 hover:text-white font-normal transition-colors"
              >
                Pricing
              </a>
            </div>

            {/* Bottom Auth Buttons stacked full width matching Screenshot 1 */}
            <div className="flex flex-col gap-3.5 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-geist w-full py-3.5 rounded-lg border border-white/[0.14] hover:border-white/[0.28] bg-zinc-950/80 text-white text-sm font-normal text-center transition-colors"
              >
                Get a Demo
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="btn-geist w-full py-3.5 rounded-lg border border-white/[0.14] hover:border-white/[0.28] bg-zinc-950/80 text-white text-sm font-normal text-center transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="btn-geist w-full py-3.5 rounded-lg bg-white text-black text-sm font-normal text-center hover:bg-zinc-200 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
