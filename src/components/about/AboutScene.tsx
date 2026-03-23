"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import type { Points as PointsMesh } from "three";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createSpherePoints } from "@/lib/sphere-points";
import { registerGsapPlugins, getScroller, prefersReducedMotion } from "@/lib/motion";

function ParticleLayer({
  positions,
  color,
  size,
  speed,
  opacity,
}: {
  positions: Float32Array;
  color: string;
  size: number;
  speed: { x: number; y: number };
  opacity: number;
}) {
  const ref = useRef<PointsMesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Subtle drift: feels alive without overwhelming performance.
    ref.current.rotation.x -= delta * speed.x;
    ref.current.rotation.y -= delta * speed.y;
  });

  return (
    <group rotation={[0, 0, Math.PI / 5]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation
          depthWrite={false}
          alphaTest={0.03}
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function ScrollReactiveScene({ aboutId }: { aboutId: string }) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const progressRef = useRef(0);
  const outer = useMemo(() => createSpherePoints(900, 1.25), []);
  const inner = useMemo(() => createSpherePoints(520, 0.75), []);

  useEffect(() => {
    registerGsapPlugins();

    const el = document.getElementById(aboutId);
    if (!el) return;
    const reduced = prefersReducedMotion();

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom top",
      scrub: reduced ? false : true,
      scroller: getScroller(),
      onUpdate: (self) => {
        progressRef.current = reduced ? 0 : self.progress;
      },
    });

    // Ensure trigger measurements are correct after Canvas mounts.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => st.kill();
  }, [aboutId]);

  useFrame(() => {
    const p = progressRef.current;
    const g = groupRef.current;

    // Move camera slightly as you scroll for depth.
    // eslint-disable-next-line react-hooks/immutability
    camera.position.x = (p - 0.5) * 0.25;
    camera.position.y = (0.5 - p) * 0.18;
    camera.lookAt(0, 0, 0);

    if (!g) return;
    g.rotation.x = p * 0.35;
    g.rotation.y = p * 0.55;
  });

  return (
    <group ref={groupRef}>
      {/* Outer glow sphere */}
      <ParticleLayer
        positions={outer}
        color="#00BFFF"
        size={0.003}
        speed={{ x: 1 / 55, y: 1 / 70 }}
        opacity={0.22}
      />
      {/* Inner shimmer sphere */}
      <ParticleLayer
        positions={inner}
        color="#D4AF77"
        size={0.0023}
        speed={{ x: -1 / 45, y: 1 / 60 }}
        opacity={0.16}
      />
    </group>
  );
}

export default function AboutScene({ aboutId }: { aboutId: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.9], fov: 44 }}
      dpr={[1, 1.2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0A0A0A"]} />
      <ScrollReactiveScene aboutId={aboutId} />
    </Canvas>
  );
}

