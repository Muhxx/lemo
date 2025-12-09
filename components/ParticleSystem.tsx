import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShapeType } from '../types';
import { generatePositions } from '../utils/generators';

interface ParticleSystemProps {
  shape: ShapeType;
  count: number;
  speed: number;
  color: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ shape, count, speed, color }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Buffers
  const { positions, colors, randomOffsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const rand = new Float32Array(count); // Per-particle random offset for noise
    
    // Initialize with Galaxy shape to start
    const initial = generatePositions(ShapeType.Galaxy, count);
    pos.set(initial);
    
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
        rand[i] = Math.random() * Math.PI * 2;
    }
    
    return { positions: pos, colors: col, randomOffsets: rand };
  }, [count]); // Re-create only if count changes

  // Target positions
  const targetPositionsRef = useRef<Float32Array>(positions.slice());
  
  useEffect(() => {
    const newTargets = generatePositions(shape, count);
    targetPositionsRef.current = newTargets;
  }, [shape, count]);

  // Handle manual color changes immediately
  useEffect(() => {
    if (!pointsRef.current) return;
    // We let the loop handle the lerping, but triggering a re-render or state update here if needed
  }, [color]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const currentPositions = geometry.attributes.position.array as Float32Array;
    const targetPositions = targetPositionsRef.current;
    const particleColors = geometry.attributes.color.array as Float32Array;
    
    // Animation params
    const time = state.clock.getElapsedTime();
    const lerpFactor = 0.03 * speed; 
    const baseColor = new THREE.Color(color);
    
    // Rotation of the entire system
    pointsRef.current.rotation.y = time * 0.05 * speed;
    pointsRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // 1. Smoothly interpolate (Lerp) position towards target shape
      currentPositions[i3] += (targetPositions[i3] - currentPositions[i3]) * lerpFactor;
      currentPositions[i3 + 1] += (targetPositions[i3 + 1] - currentPositions[i3 + 1]) * lerpFactor;
      currentPositions[i3 + 2] += (targetPositions[i3 + 2] - currentPositions[i3 + 2]) * lerpFactor;

      // 2. Add "Chaos" / Breathing Noise
      const noiseAmp = 0.03 * speed;
      const offset = randomOffsets[i];
      
      // Add sine wave motion based on time and random offset
      currentPositions[i3] += Math.sin(time * 1.5 + offset) * noiseAmp;
      currentPositions[i3 + 1] += Math.cos(time * 1.2 + offset) * noiseAmp;
      currentPositions[i3 + 2] += Math.sin(time * 1.8 + offset) * noiseAmp;

      // 3. Dynamic Coloring based on position and time
      const x = currentPositions[i3];
      const y = currentPositions[i3 + 1];
      const z = currentPositions[i3 + 2];
      const dist = Math.sqrt(x*x + y*y + z*z);
      
      // Pulse effect 0..1
      const pulse = (Math.sin(time * 2 + offset) + 1) * 0.5; 
      
      // Mix base color with brightness based on distance from center
      // Center is hotter/brighter, edges are cooler/darker
      particleColors[i3] = baseColor.r + (pulse * 0.15) - (dist * 0.005);
      particleColors[i3 + 1] = baseColor.g + (pulse * 0.15) - (dist * 0.005);
      particleColors[i3 + 2] = baseColor.b + (pulse * 0.3) + (dist * 0.005);
    }

    // Flag attributes as needing updates for Three.js
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  // Create a glow texture programmatically
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Soft radial glow
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Core
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Edge
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15} // Slightly smaller for crisper look
        map={texture}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default ParticleSystem;