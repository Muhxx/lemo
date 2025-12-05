import { ShapeType } from '../types';
import * as THREE from 'three';

export const generatePositions = (shape: ShapeType, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const scale = 12; // Base scale

  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Standardize randomization for volume
    const rand1 = (i % 1000) / 1000;
    const rand2 = (i % 50) / 50;
    
    let x = 0, y = 0, z = 0;

    switch (shape) {
      case ShapeType.Galaxy: {
        // Logarithmic Spiral Galaxy
        const arms = 3;
        const spin = t * Math.PI * 2 * arms;
        const radius = Math.pow(t, 0.5) * scale * 1.5; // Spread out more
        
        // Add thickness to the galaxy disc
        const thickness = (1 - t) * 2; // Thicker at center
        const randomOffset = Math.random() - 0.5;
        
        x = Math.cos(spin) * radius + (Math.random() - 0.5);
        y = (Math.random() - 0.5) * thickness;
        z = Math.sin(spin) * radius + (Math.random() - 0.5);
        break;
      }

      case ShapeType.Cardioid: {
        // 3D Heart Shape (Rotation of a cardioid or specific implicit surface approx)
        // Formula: 16sin^3(t) ...
        // Let's use a volumetric distribution inside a heart shape
        const phi = t * Math.PI * 2; // horizontal
        const theta = rand1 * Math.PI; // vertical
        
        // 3D Heart parametric approximation
        // x = 16sin^3(u)
        // y = 13cos(u) - 5cos(2u) - 2cos(3u) - cos(4u)
        // extended to 3D by rotating or layering
        
        const u = t * Math.PI * 2;
        const r = scale * 0.05; // Scaling factor
        
        // Base heart curve
        const hx = 16 * Math.pow(Math.sin(u), 3);
        const hy = 13 * Math.cos(u) - 5 * Math.cos(2*u) - 2 * Math.cos(3*u) - Math.cos(4*u);
        
        // Add volume by spreading along Z and scaling based on "thickness" of a heart
        const depth = (Math.random() - 0.5) * 4 * (1 - Math.abs(u - Math.PI)/Math.PI);
        
        x = hx * r;
        y = hy * r;
        z = depth;
        break;
      }

      case ShapeType.Butterfly: {
        // 3D Butterfly Curve
        const u = t * Math.PI * 12; // More loops
        const part = Math.pow(Math.E, Math.cos(u)) - 2 * Math.cos(4*u) - Math.pow(Math.sin(u/12), 5);
        
        x = Math.sin(u) * part * scale * 0.5;
        y = Math.cos(u) * part * scale * 0.5;
        // Z variation creates the "wings" volume
        z = Math.sin(u * 2) * scale * 0.2 * part; 
        break;
      }

      case ShapeType.Rose: {
        // Rhodonea Curve (Rose) - Spherical
        const k = 7; // Number of petals
        const theta = t * Math.PI * 2;
        const phi = rand1 * Math.PI; // Volume
        
        const r = Math.sin(k * theta) * scale;
        
        // Map to sphere-ish
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        break;
      }

      case ShapeType.Archimedean: {
        // 3D Conic Spiral
        const loops = 10;
        const theta = t * Math.PI * 2 * loops;
        const r = 0.5 * theta * 0.1 * scale;
        const height = (t - 0.5) * scale * 2;
        
        x = r * Math.cos(theta);
        z = r * Math.sin(theta);
        y = height;
        break;
      }

      case ShapeType.Lemniscate: {
        // Bernoulli Lemniscate (Infinity) with Twist
        const theta = t * Math.PI * 2;
        const denom = 1 + Math.sin(theta)**2;
        
        // Base 2D
        const lx = (scale * Math.cos(theta)) / denom;
        const ly = 0;
        const lz = (scale * Math.cos(theta) * Math.sin(theta)) / denom;
        
        // Twist into Mobius strip-like volume
        const twist = Math.sin(theta * 2) * 2;
        
        x = lx;
        y = twist + (Math.random() - 0.5); // Add thickness
        z = lz;
        break;
      }

      case ShapeType.Catenary: {
        // Catenoid (Surface of revolution of a catenary)
        const c = 3; // curve tightness
        const u = (t - 0.5) * 3; // height range
        const v = rand1 * Math.PI * 2; // rotation
        
        const r = c * Math.cosh(u/c);
        
        x = r * Math.cos(v);
        z = r * Math.sin(v);
        y = u * scale * 0.5;
        break;
      }

      case ShapeType.KochCurve: {
        // 3D Fractal approximation (Snowflake-ish cylinder)
        // We project a Koch snowflake on XY and extrude Z
        // Approximation: Sum of triangular frequencies
        
        const angle = t * Math.PI * 2;
        let r = scale * 0.6;
        
        // Add fractal frequencies
        r += Math.abs(Math.sin(angle * 3)) * scale * 0.2;
        r += Math.abs(Math.sin(angle * 9)) * scale * 0.1;
        r += Math.abs(Math.sin(angle * 27)) * scale * 0.05;
        r += Math.abs(Math.sin(angle * 81)) * scale * 0.025;
        
        x = r * Math.cos(angle);
        y = r * Math.sin(angle);
        z = (rand1 - 0.5) * scale; // Cylinder height
        break;
      }

      default:
        x = (Math.random() - 0.5) * scale;
        y = (Math.random() - 0.5) * scale;
        z = (Math.random() - 0.5) * scale;
    }

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};