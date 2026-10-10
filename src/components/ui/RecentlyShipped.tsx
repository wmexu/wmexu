"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { EncryptedText } from "@/components/ui/encrypted-text";

function BentoCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Silky scroll-linked scaling: starts at 0.94, gently reaches 1.0, and glides down to 0.94 on exit
  const scale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [0.94, 1, 1, 0.94]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    [0.78, 1, 1, 0.78]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity }}
      className={`w-full ${className}`}
    >
      {/* 
        Hover animation with smooth spring deceleration curve in BOTH directions
        (no abrupt snap/punch on mouseleave)
      */}
      <motion.div
        whileHover={{ scale: 1.014 }}
        transition={{
          type: "spring",
          stiffness: 110,
          damping: 18,
          mass: 0.9,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function RecentlyShipped() {
  const card1Ref = useRef<HTMLDivElement>(null);
  const card1InView = useInView(card1Ref, { once: false, amount: 0.15 });

  const card2Ref = useRef<HTMLDivElement>(null);
  const card2InView = useInView(card2Ref, { once: false, amount: 0.15 });

  const card3Ref = useRef<HTMLDivElement>(null);
  const card3InView = useInView(card3Ref, { once: false, amount: 0.15 });

  const CARD_DURATION_MS = 650;

  return (
    <section id="skills" className="w-full py-16 sm:py-28 scroll-mt-24">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading with 450 weight and clean spacing */}
        <h2
          className="text-heading-section text-white mb-8 sm:mb-14 tracking-tight whitespace-nowrap sm:whitespace-normal sm:text-balance"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "clamp(26px, 6.2vw, 53px)",
            lineHeight: "1.1",
            letterSpacing: "-2px",
            fontWeight: 450,
          }}
        >
          <EncryptedText
            text="Skills & Architecture"
            encryptedClassName="text-zinc-600"
            revealedClassName="text-white"
            durationMs={600}
          />
        </h2>

        {/* Bento Grid with smooth spring physics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Large Left Card (Full/Stack) */}
          <div className="lg:col-span-7 flex">
            <BentoCard>
              <div
                ref={card1Ref}
                className="w-full h-full rounded-2xl border border-white/[0.08] hover:border-white/[0.18] bg-[#000000] p-7 sm:p-12 lg:p-14 flex flex-col justify-between min-h-[360px] sm:min-h-[520px] relative overflow-hidden group transition-colors duration-500"
              >
                {/* Background geometric watermark art: Clean Architectural "F" with no slash */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-500">
                  <svg
                    viewBox="0 0 400 300"
                    className="w-full h-full text-white stroke-current fill-none stroke-[1.5]"
                  >
                    {/* Architectural Letter "F" Wireframe */}
                    <path d="M 60 40 H 340 V 100 H 140 V 150 H 280 V 200 H 140 V 260 H 60 Z" />
                    {/* Architectural Grid Guidelines */}
                    <line x1="140" y1="20" x2="140" y2="280" opacity="0.35" />
                    <line x1="220" y1="40" x2="220" y2="220" opacity="0.35" />
                    <line x1="280" y1="40" x2="280" y2="220" opacity="0.35" />
                  </svg>
                </div>

                <div />

                {/* Bottom Content: Synchronized decryption ending at the exact same millisecond */}
                <div className="relative z-10 pt-16 sm:pt-0">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span
                      className="text-2xl sm:text-3xl lg:text-[32px] tracking-tight text-white font-medium-450"
                      style={{
                        fontFamily: "var(--font-geist-sans), sans-serif",
                      }}
                    >
                      <EncryptedText
                        text="Full/Stack"
                        encryptedClassName="text-zinc-600"
                        revealedClassName="text-white"
                        inView={card1InView}
                        durationMs={CARD_DURATION_MS}
                      />
                    </span>
                  </div>
                  <p
                    className="text-zinc-400 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed"
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                    }}
                  >
                    <EncryptedText
                      text="full-stack is the architecture for building complete, production-grade applications."
                      encryptedClassName="text-zinc-600"
                      revealedClassName="text-zinc-400"
                      inView={card1InView}
                      durationMs={CARD_DURATION_MS}
                    />
                  </p>
                </div>
              </div>
            </BentoCard>
          </div>

          {/* Right Column: 2 Stacked Cards (Frontend & UI, Database & API) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 justify-between">
            {/* Card 2: Frontend & UI */}
            <BentoCard className="flex-1 flex">
              <div
                ref={card2Ref}
                className="w-full h-full rounded-2xl border border-white/[0.08] hover:border-white/[0.18] bg-[#000000] p-7 sm:p-10 lg:p-12 flex flex-col justify-center min-h-[180px] sm:min-h-[240px] relative overflow-hidden group transition-colors duration-500"
              >
                <h3
                  className="text-2xl sm:text-3xl lg:text-[28px] text-white font-medium-450 tracking-tight"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                  }}
                >
                  <EncryptedText
                    text="Frontend & UI"
                    encryptedClassName="text-zinc-600"
                    revealedClassName="text-white"
                    inView={card2InView}
                    durationMs={CARD_DURATION_MS}
                  />
                </h3>
                <p
                  className="text-zinc-400 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 font-normal leading-relaxed w-full"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                  }}
                >
                  <EncryptedText
                    text="Developing fast, interactive, and responsive user interfaces with Next.js, React, and custom styling."
                    encryptedClassName="text-zinc-600"
                    revealedClassName="text-zinc-400"
                    inView={card2InView}
                    durationMs={CARD_DURATION_MS}
                  />
                </p>
              </div>
            </BentoCard>

            {/* Card 3: Database & API */}
            <BentoCard className="flex-1 flex">
              <div
                ref={card3Ref}
                className="w-full h-full rounded-2xl border border-white/[0.08] hover:border-white/[0.18] bg-[#000000] p-7 sm:p-10 lg:p-12 flex flex-col justify-center min-h-[180px] sm:min-h-[240px] relative overflow-hidden group transition-colors duration-500"
              >
                <h3
                  className="text-2xl sm:text-3xl lg:text-[28px] text-white font-medium-450 tracking-tight"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                  }}
                >
                  <EncryptedText
                    text="Database & API"
                    encryptedClassName="text-zinc-600"
                    revealedClassName="text-white"
                    inView={card3InView}
                    durationMs={CARD_DURATION_MS}
                  />
                </h3>
                <p
                  className="text-zinc-400 text-sm sm:text-base lg:text-lg mt-3 sm:mt-4 font-normal leading-relaxed w-full"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                  }}
                >
                  <EncryptedText
                    text="Designing performant database schemas, optimized queries, and secure API integrations with PostgreSQL and Node."
                    encryptedClassName="text-zinc-600"
                    revealedClassName="text-zinc-400"
                    inView={card3InView}
                    durationMs={CARD_DURATION_MS}
                  />
                </p>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
