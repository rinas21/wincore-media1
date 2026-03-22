/**
 * Uniform random points inside a sphere — always finite (avoids NaN bounding spheres in THREE).
 */
export function createSpherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());
    const ix = i * 3;
    positions[ix] = r * Math.sin(phi) * Math.cos(theta);
    positions[ix + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[ix + 2] = r * Math.cos(phi);
  }
  return positions;
}
