import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ShapeType } from './types';
import ParticleSystem from './components/ParticleSystem';
import EditorOverlay from './components/EditorOverlay';

const App: React.FC = () => {
  // State
  const [currentShape, setCurrentShape] = useState<ShapeType>(ShapeType.Galaxy);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [color, setColor] = useState<string>('#a855f7'); 
  const particleCount = 30000;

  // Auto-switch logic
  useEffect(() => {
    if (!autoPlay) return;

    const shapes = Object.values(ShapeType);
    const interval = setInterval(() => {
      setCurrentShape((prev) => {
        const currentIndex = shapes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % shapes.length;
        return shapes[nextIndex];
      });
    }, 6000); // Slower switch for grandeur

    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <Canvas
        camera={{ position: [0, 15, 40], fov: 50 }}
        gl={{ 
          antialias: false, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} 
      >
        <color attach="background" args={['#020202']} />
        
        {/* Subtle Ambient Light for mood */}
        <ambientLight intensity={0.2} />
        
        <ParticleSystem
          shape={currentShape}
          count={particleCount}
          speed={speed}
          color={color}
        />

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          autoRotate={!autoPlay}
          autoRotateSpeed={0.3}
          maxDistance={80}
          minDistance={10}
        />
        
        {/* Deep fog for infinite void feel */}
        <fog attach="fog" args={['#020202', 20, 90]} />
      </Canvas>

      <EditorOverlay
        currentShape={currentShape}
        setShape={(s) => {
          setCurrentShape(s);
          setAutoPlay(false);
        }}
        autoPlay={autoPlay}
        toggleAutoPlay={() => setAutoPlay(!autoPlay)}
        speed={speed}
        setSpeed={setSpeed}
        color={color}
        setColor={setColor}
      />
    </div>
  );
};

export default App;