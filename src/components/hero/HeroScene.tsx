"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointMaterial, Points } from "@react-three/drei";
import type { Points as PointsMesh } from "three";
import * as THREE from "three";
import { createSpherePoints } from "@/lib/sphere-points";

function CameraParallax({ heroId }: { heroId: string }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hero = () => document.getElementById(heroId);
    const onMove = (e: MouseEvent) => {
      const el = hero();
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      target.current.x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1;
      target.current.y = -((e.clientY - r.top) / Math.max(r.height, 1)) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [heroId]);

  useFrame(() => {
    const tx = target.current.x * 0.16;
    const ty = target.current.y * 0.11;
    camera.position.x += (tx - camera.position.x) * 0.06;
    camera.position.y += (ty - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function ParticleLayer({
  positions,
  color,
  size,
  speed,
  opacity = 0.62,
  additive = true,
}: {
  positions: Float32Array;
  color: string;
  size: number;
  speed: { x: number; y: number };
  opacity?: number;
  additive?: boolean;
}) {
  const ref = useRef<PointsMesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
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
          opacity={opacity}
          blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </Points>
    </group>
  );
}

export default function HeroScene({ heroId }: { heroId: string }) {
  const outer = useMemo(() => createSpherePoints(2000, 1.45), []);
  const inner = useMemo(() => createSpherePoints(900, 0.72), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 1.55], fov: 48 }}
      dpr={[1, 1.75]}
      gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#0A0A0A"]} />
        <CameraParallax heroId={heroId} />
        <ParticleLayer
          positions={outer}
          color="#00BFFF"
          size={0.004}
          speed={{ x: 1 / 17, y: 1 / 22 }}
        />
        <ParticleLayer
          positions={inner}
          color="#D4AF77"
          size={0.0026}
          speed={{ x: -1 / 14, y: 1 / 18 }}
          opacity={0.45}
          additive={false}
        />
      </Suspense>
    </Canvas>
  );
}
