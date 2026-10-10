"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Html, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Scanline,
} from "@react-three/postprocessing";
import * as THREE from "three";

function CyberCore({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef1 = useRef<THREE.Mesh>(null!);
  const ringRef2 = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x += delta * 0.4;
      ringRef1.current.rotation.z += delta * 0.2;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y += delta * 0.35;
      ringRef2.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      {/* Central Distorted Cyber Orb */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.4, isMobile ? 3 : 5]} />
        <MeshDistortMaterial
          color="#00f0ff"
          emissive="#004466"
          roughness={0.15}
          metalness={0.9}
          distort={0.35}
          speed={2.2}
          wireframe={false}
        />

        {/* Floating Cyber Telemetry Tag */}
        <Html
          position={[1.5, 1.2, 0]}
          distanceFactor={6}
          center
          className="pointer-events-none select-none"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyan-400/40 bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.3)] text-cyan-300 font-mono text-[11px] whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>SYS: WMEXU-QUANTUM-NODE</span>
            <span className="text-zinc-500">|</span>
            <span className="text-emerald-400">99.98% SYNC</span>
          </div>
        </Html>
      </mesh>

      {/* Outer Gyroscopic Ring 1 */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.2, 0.025, 16, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#581c87"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Gyroscopic Ring 2 */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.7, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0369a1"
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Floating secondary telemetry */}
      <Html
        position={[-1.7, -1.4, 0]}
        distanceFactor={6}
        center
        className="pointer-events-none select-none"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-purple-500/30 bg-black/75 backdrop-blur-sm text-purple-300 font-mono text-[10px] whitespace-nowrap">
          <span className="text-zinc-400">CLK:</span>
          <span>4.8 GHz</span>
          <span className="text-zinc-500">/</span>
          <span className="text-cyan-400">ACTIVE</span>
        </div>
      </Html>
    </Float>
  );
}

export default function Cyber3DScene() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMotion = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    mediaQuery.addEventListener("change", handleMotion);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", handleMotion);
    };
  }, []);

  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f0ff" />
        <pointLight position={[-10, -10, -5]} intensity={1.2} color="#a855f7" />

        <CyberCore isMobile={isMobile} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.3}
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.8}
        />

        {/* Postprocessing enabled only for non-mobile and non-reduced-motion */}
        {!isMobile && !reducedMotion && (
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.1}
            />
            <ChromaticAberration
              offset={new THREE.Vector2(0.001, 0.001)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Scanline density={1.2} opacity={0.12} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
