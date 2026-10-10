"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
} from "@icons-pack/react-simple-icons";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Frontend",
    links: [
      { name: "Next.js (App Router)", href: "https://nextjs.org/docs/app" },
      { name: "React", href: "https://react.dev/" },
      { name: "TypeScript", href: "https://www.typescriptlang.org/" },
      { name: "Tailwind CSS", href: "https://tailwindcss.com/" },
      { name: "Three.js / WebGL", href: "https://threejs.org/" },
      { name: "Responsive UI", href: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" },
    ],
  },
  {
    title: "Backend & Database",
    links: [
      { name: "Node.js", href: "https://nodejs.org/" },
      { name: "PostgreSQL", href: "https://www.postgresql.org/" },
      { name: "REST APIs", href: "https://restfulapi.net/" },
    ],
  },
  {
    title: "DevOps & Infrastructure",
    links: [
      { name: "Git / GitHub", href: "https://github.com/" },
      { name: "Docker", href: "https://www.docker.com/" },
      { name: "Vercel Deployments", href: "https://vercel.com/" },
    ],
  },
  {
    title: "Links & Contact",
    links: [
      { name: "Telegram (@wmexu)", href: "https://t.me/wmexu" },
      { name: "GitHub (wmexu)", href: "https://github.com/wmexu" },
      { name: "Order Project", href: "https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project." },
      { name: "Source Code", href: "https://github.com/wmexu" },
      { name: "wmexu.xyz", href: "https://wmexu.xyz" },
    ],
  },
];

export default function BuiltByAgentsAndFooter() {
  return (
    <div className="w-full pt-16 sm:pt-24 pb-16 sm:pb-20">
      {/* "From idea to production." Call to action */}
      <section
        id="discuss"
        className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 text-center pb-20 sm:pb-32 scroll-mt-24"
      >
        <h2
          className="text-heading-hero text-white tracking-tight text-balance mb-8 sm:mb-10"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "clamp(34px, 7.5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-2.6px",
            fontWeight: 450,
          }}
        >
          From idea to production.
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto">
          {/* Discuss an project button directing to Telegram */}
          <a
            href="https://t.me/wmexu?text=Hello,%20i%20would%20like%20to%20discuss%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-geist w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black text-sm sm:text-base font-normal hover:bg-zinc-200 transition-colors shadow-sm text-center inline-flex items-center justify-center select-none"
          >
            Discuss an project
          </a>

          {/* Explore button with 3 simple-icons (Next.js, TypeScript, React) with 15deg tilted white gradient on black */}
          <a
            href="https://github.com/wmexu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-geist w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-zinc-950/80 border border-white/[0.14] hover:border-white/[0.3] text-zinc-200 hover:text-white text-sm sm:text-base font-normal transition-colors group select-none"
          >
            <div className="flex -space-x-1.5 items-center">
              {/* Next.js Icon */}
              <span
                className="w-5 h-5 rounded-full border border-white/[0.14] flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-inner"
                style={{
                  background:
                    "linear-gradient(345deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 40%, #000000 70%)",
                }}
              >
                <SiNextdotjs color="currentColor" className="w-2.5 h-2.5 text-white" />
              </span>

              {/* TypeScript Icon */}
              <span
                className="w-5 h-5 rounded-full border border-white/[0.14] flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-inner"
                style={{
                  background:
                    "linear-gradient(345deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 40%, #000000 70%)",
                }}
              >
                <SiTypescript color="currentColor" className="w-2.5 h-2.5 text-white" />
              </span>

              {/* React Icon */}
              <span
                className="w-5 h-5 rounded-full border border-white/[0.14] flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-inner"
                style={{
                  background:
                    "linear-gradient(345deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 40%, #000000 70%)",
                }}
              >
                <SiReact color="currentColor" className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <span>Explore</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-0.5" />
          </a>
        </div>
      </section>

      {/* Multi-Column Footer: Exactly 4 columns (Frontend, Backend & Database, DevOps & Infrastructure, Links & Contact) */}
      <footer className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 border-t border-white/[0.08] pt-12 sm:pt-16 text-sm font-normal">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h4 className="text-white font-medium-450 text-sm mb-1 tracking-tight">
                {column.title}
              </h4>
              <div className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 group w-fit text-sm"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                      {link.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-normal">
          <div>© 2026 wmexu.xyz. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span>Designed & Engineered by</span>
            <span className="text-zinc-300">wmexu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
