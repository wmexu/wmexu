"use client";

import "@/lib/react-compat";
import React, { useEffect, useState, ComponentType } from "react";

interface CyberScrambleProps {
  text: string;
  className?: string;
  autoStart?: boolean;
  mouseEnterTrigger?: "start" | "pause" | "reset" | "restart";
  speed?: "slow" | "medium" | "fast";
  roll?: number;
}

export default function CyberScramble({
  text,
  className = "",
  autoStart = true,
  mouseEnterTrigger = "restart",
  speed = "medium",
  roll = 8,
}: CyberScrambleProps) {
  const [ScrambleComponent, setScrambleComponent] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    // Ensure React.createFactory polyfill exists before evaluating react-scramble
    if (typeof React !== "undefined" && !(React as any).createFactory) {
      (React as any).createFactory = (type: any) => React.createElement.bind(null, type);
    }

    import("react-scramble")
      .then((mod) => {
        setScrambleComponent(() => mod.default);
      })
      .catch((err) => {
        console.warn("Failed to load react-scramble:", err);
      });
  }, []);

  if (!ScrambleComponent) {
    return (
      <span className={`inline-block font-mono tracking-wider ${className}`}>
        {text}
      </span>
    );
  }

  const Comp = ScrambleComponent;

  return (
    <span className={`inline-block font-mono tracking-wider ${className}`}>
      <Comp
        autoStart={autoStart}
        text={text}
        speed={speed}
        mouseEnterTrigger={mouseEnterTrigger}
        steps={[
          {
            roll,
            action: "+",
            type: "all",
          },
          {
            action: "-",
            type: "forward",
          },
        ]}
      />
    </span>
  );
}
