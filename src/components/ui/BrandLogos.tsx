"use client";

import React from "react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiPostgresql,
  SiTailwindcss,
  SiDocker,
} from "@icons-pack/react-simple-icons";

const TECH_STACK = [
  { name: "Next.js", Icon: SiNextdotjs, href: "https://nextjs.org/" },
  { name: "TypeScript", Icon: SiTypescript, href: "https://www.typescriptlang.org/" },
  { name: "React", Icon: SiReact, href: "https://react.dev/" },
  { name: "PostgreSQL", Icon: SiPostgresql, href: "https://www.postgresql.org/" },
  { name: "Tailwind", Icon: SiTailwindcss, href: "https://tailwindcss.com/" },
  { name: "Docker", Icon: SiDocker, href: "https://www.docker.com/" },
];

export default function BrandLogos() {
  return (
    <div className="w-full pt-4 pb-6 sm:pb-8">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="w-full flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-6 sm:gap-x-8 lg:gap-x-4 gap-y-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
          {TECH_STACK.map((tech) => (
            <a
              key={tech.name}
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 sm:gap-3 text-zinc-400 hover:text-white transition-colors cursor-pointer font-normal tracking-tight select-none whitespace-nowrap group"
              style={{
                fontSize: "clamp(17px, 1.75vw, 25.5px)",
              }}
            >
              <tech.Icon
                color="currentColor"
                style={{
                  width: "1.2em",
                  height: "1.2em",
                }}
                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <span>{tech.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
