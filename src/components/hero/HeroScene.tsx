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
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const hero = () => document.getElementById(heroId);
    const onMove = (e: PointerEvent) => {
      const el = hero();
      if (!el) return;
      const r = el.getBoundingClientRect();

      const isOutside =
        e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right;
      if (isOutside) {
        target.current.x = 0;
        target.current.y = 0;
        return;
      }
      target.current.x = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1;
      target.current.y = -((e.clientY - r.top) / Math.max(r.height, 1)) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [heroId]);

  useFrame(() => {
    // Damped pointer motion to avoid jittery camera changes.
    smooth.current.x += (target.current.x - smooth.current.x) * 0.06;
    smooth.current.y += (target.current.y - smooth.current.y) * 0.06;

    const tx = smooth.current.x * 0.06;
    const ty = smooth.current.y * 0.045;
    // eslint-disable-next-line react-hooks/immutability
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
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
  additive = false,
  pulse = false,
}: {
  positions: Float32Array;
  color: string;
  size: number;
  speed: { x: number; y: number };
  opacity?: number;
  additive?: boolean;
  pulse?: boolean;
}) {
  const ref = useRef<PointsMesh>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    elapsed.current += delta;
    ref.current.rotation.x -= delta * speed.x;
    ref.current.rotation.y -= delta * speed.y;
    if (pulse) {
      const s = 1 + Math.sin(elapsed.current * 0.55) * 0.018;
      ref.current.scale.set(s, s, s);
    }
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
          blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </Points>
    </group>
  );
}

export default function HeroScene({ heroId }: { heroId: string }) {
  const outer = useMemo(() => createSpherePoints(1600, 1.3), []);
  const inner = useMemo(() => createSpherePoints(780, 0.72), []);
  const halo = useMemo(() => createSpherePoints(480, 1.72), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 1.55], fov: 40 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <CameraParallax heroId={heroId} />
        <ParticleLayer
          positions={outer}
          color="#00BFFF"
          size={0.0028}
          speed={{ x: 1 / 45, y: 1 / 60 }}
          opacity={0.28}
        />
        <ParticleLayer
          positions={inner}
          color="#D4AF77"
          size={0.0022}
          speed={{ x: -1 / 40, y: 1 / 50 }}
          opacity={0.2}
          additive={false}
          pulse
        />
        <ParticleLayer
          positions={halo}
          color="#6ECFF6"
          size={0.0018}
          speed={{ x: 1 / 65, y: -1 / 70 }}
          opacity={0.14}
        />
      </Suspense>
    </Canvas>
  );
}
