declare module "react-scramble" {
  import React from "react";

  export interface ScrambleStep {
    action?: string;
    roll?: number;
    text?: string;
    type?: "all" | "random" | "forward";
  }

  export interface ScrambleProps {
    text: string;
    autoStart?: boolean;
    speed?: "slow" | "medium" | "fast";
    steps?: ScrambleStep[];
    noBreakSpace?: boolean;
    preScramble?: boolean;
    mouseEnterTrigger?: "start" | "pause" | "reset" | "restart";
    mouseLeaveTrigger?: "start" | "pause" | "reset" | "restart";
    bindMethod?: (methods: {
      start: () => void;
      pause: () => void;
      reset: () => void;
      restart: () => void;
    }) => void;
    className?: string;
  }

  const Scramble: React.FC<ScrambleProps>;
  export default Scramble;
}
