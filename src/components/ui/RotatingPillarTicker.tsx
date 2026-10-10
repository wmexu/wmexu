"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EncryptedText } from "@/components/ui/encrypted-text";

const PILLARS = [
  "Engineered end-to-end",
  "Optimized for speed & conversion",
  "Clean, maintainable code",
];

export default function RotatingPillarTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PILLARS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 flex items-center justify-center font-mono text-xs sm:text-[13px] text-zinc-400 select-none overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={PILLARS[index]}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <EncryptedText
            text={PILLARS[index]}
            encryptedClassName="text-zinc-600"
            revealedClassName="text-zinc-400"
            revealDelayMs={25}
          />
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
