"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export type EncryptedTextProps = {
  text: string;
  className?: string;
  /**
   * Optional total duration in milliseconds for the entire decryption reveal.
   * If provided, all characters are revealed over this exact duration, regardless of text length.
   * This allows headers and long descriptions to finish decrypting at the exact same time!
   */
  durationMs?: number;
  /**
   * Time in milliseconds between revealing each subsequent real character.
   * Ignored if durationMs is provided. Defaults to 50ms per character.
   */
  revealDelayMs?: number;
  /** Optional custom character set to use for the gibberish effect. */
  charset?: string;
  /**
   * Time in milliseconds between gibberish flips for unrevealed characters.
   * Lower is more jittery. Defaults to 40ms.
   */
  flipDelayMs?: number;
  /** CSS class for styling the encrypted/scrambled characters */
  encryptedClassName?: string;
  /** CSS class for styling the revealed characters */
  revealedClassName?: string;
  /**
   * Optional external inView control to synchronize multiple text elements
   * (e.g. card header + card description starting and finishing together).
   */
  inView?: boolean;
  /**
   * Whether to animate only once. Defaults to false so scrolling between
   * sections re-encrypts the text, and scrolling back triggers fresh decryption.
   */
  once?: boolean;
};

const DEFAULT_CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[];:,.<>/?";

/**
 * Deterministically generates a scrambled character for SSR and the first load stage.
 * Preserves spaces and character casing (lowercase remains lowercase/narrow)
 * so text width never jumps or exceeds the final revealed width, completely preventing halo collision.
 */
function getInitialCipherChar(char: string, index: number): string {
  if (char === " ") return " ";

  if (char >= "a" && char <= "z") {
    // Pure lowercase & narrow symbols: compact width matching lowercase text
    const pool = "xkzvpqwsjfltrmeycnhadg0123456789/*-+;:_~";
    const hash = Math.abs((index * 19 + char.charCodeAt(0) * 31 + 43) % pool.length);
    return pool[hash];
  }

  if (char >= "A" && char <= "Z") {
    const pool = "XKZVPQWSJFLTRMEYCNHADG0123456789/*-+;:_~";
    const hash = Math.abs((index * 19 + char.charCodeAt(0) * 31 + 43) % pool.length);
    return pool[hash];
  }

  // Numbers or punctuation
  const pool = "0123456789/*-+;:_~#";
  const hash = Math.abs((index * 13 + char.charCodeAt(0) * 17 + 29) % pool.length);
  return pool[hash];
}

/**
 * Generates random gibberish character matching the case of the target character.
 * Prevents wide capital letters from expanding lowercase text lines during live flips.
 */
function generateRandomCharacterForChar(char: string, charset?: string): string {
  if (char >= "a" && char <= "z") {
    const lowercasePool = "abcdefghijklmnopqrstuvwxyz0123456789/*-+;:_~#";
    return lowercasePool.charAt(Math.floor(Math.random() * lowercasePool.length));
  }
  if (char >= "A" && char <= "Z") {
    const uppercasePool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/*-+;:_~#";
    return uppercasePool.charAt(Math.floor(Math.random() * uppercasePool.length));
  }
  const pool = charset || "0123456789/*-+;:_~#!@#$%^&*";
  const index = Math.floor(Math.random() * pool.length);
  return pool.charAt(index);
}

function generateGibberishPreservingCasing(
  original: string,
  charset?: string,
): string[] {
  if (!original) return [];
  const result: string[] = [];
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i];
    result.push(ch === " " ? " " : generateRandomCharacterForChar(ch, charset));
  }
  return result;
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  durationMs,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 40,
  encryptedClassName,
  revealedClassName,
  inView: propInView,
  once = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const selfInView = useInView(ref, { once, amount: 0.15 });
  const isInView = propInView !== undefined ? propInView : selfInView;

  const [revealCount, setRevealCount] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastFlipTimeRef = useRef<number>(0);
  const scrambleCharsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!isInView) {
      setRevealCount(0);
      return;
    }

    // Reset state for a fresh animation whenever dependencies change or entering view
    scrambleCharsRef.current = generateGibberishPreservingCasing(text, charset);
    startTimeRef.current = performance.now();
    lastFlipTimeRef.current = startTimeRef.current;
    setRevealCount(0);

    let isCancelled = false;

    const update = (now: number) => {
      if (isCancelled) return;

      const elapsedMs = now - startTimeRef.current;
      const totalLength = text.length;

      let currentRevealCount: number;
      if (durationMs && durationMs > 0) {
        currentRevealCount = Math.min(
          totalLength,
          Math.floor((elapsedMs / durationMs) * totalLength),
        );
      } else {
        currentRevealCount = Math.min(
          totalLength,
          Math.floor(elapsedMs / Math.max(1, revealDelayMs)),
        );
      }

      setRevealCount(currentRevealCount);

      if (currentRevealCount >= totalLength) {
        return;
      }

      // Re-randomize unrevealed scramble characters on an interval
      const timeSinceLastFlip = now - lastFlipTimeRef.current;
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        for (let index = 0; index < totalLength; index += 1) {
          if (index >= currentRevealCount) {
            if (text[index] !== " ") {
              scrambleCharsRef.current[index] = generateRandomCharacterForChar(
                text[index],
                charset,
              );
            } else {
              scrambleCharsRef.current[index] = " ";
            }
          }
        }
        lastFlipTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      isCancelled = true;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInView, text, durationMs, revealDelayMs, charset, flipDelayMs]);

  if (!text) return null;

  return (
    <motion.span
      ref={ref}
      className={cn(className)}
      aria-label={text}
      role="text"
    >
      {text.split("").map((char, index) => {
        const isRevealed = index < revealCount;
        const displayChar = isRevealed
          ? char
          : char === " "
            ? " "
            : (scrambleCharsRef.current[index] ??
              getInitialCipherChar(char, index));

        return (
          <span
            key={index}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {displayChar}
          </span>
        );
      })}
    </motion.span>
  );
};
