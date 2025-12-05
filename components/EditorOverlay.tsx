import React from 'react';
import { ShapeType } from '../types';
import { Play, Pause, Settings2, Sparkles, Palette } from 'lucide-react';

interface EditorOverlayProps {
  currentShape: ShapeType;
  setShape: (s: ShapeType) => void;
  autoPlay: boolean;
  toggleAutoPlay: () => void;
  speed: number;
  setSpeed: (s: number) => void;
  color: string;
  setColor: (c: string) => void;
}

const shapes = Object.values(ShapeType);

const EditorOverlay: React.FC<EditorOverlayProps> = ({
  currentShape,
  setShape,
  autoPlay,
  toggleAutoPlay,
  speed,
  setSpeed,
  color,
  setColor
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 overflow-hidden">
      
      {/* Top Header - Minimal */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="animate-fade-in-down">
          <h1 className="text-4xl font-thin tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            VORTEX
          </h1>
          <p className="text-white/50 text-xs tracking-widest uppercase mt-1 ml-1">Mathematical Chaos Engine</p>
        </div>
        
        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
            autoPlay 
              ? 'bg-white/10 border-purple-500/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
              : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {autoPlay ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          <span className="text-xs font-medium tracking-wide">{autoPlay ? 'AUTO FLOW' : 'PAUSED'}</span>
        </button>
      </div>

      {/* Main Controls - Bottom Bar */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto animate-slide-up">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col gap-6">
          
          {/* Shape Selector - Horizontal Scroll */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
              <Sparkles size={12} />
              <span>Geometry</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar mask-gradient">
              {shapes.map((shape) => (
                <button
                  key={shape}
                  onClick={() => setShape(shape)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm transition-all duration-300 border ${
                    currentShape === shape
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] font-bold scale-105'
                      : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Speed Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-white/60 text-xs uppercase tracking-widest font-bold">
                <div className="flex items-center gap-2">
                  <Settings2 size={12} />
                  <span>Chaos Speed</span>
                </div>
                <span>{Math.round(speed * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-purple-200 transition-all"
              />
            </div>

            {/* Color Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
                <Palette size={12} />
                <span>Nebula Color</span>
              </div>
              <div className="flex justify-between md:justify-start gap-4">
                {[
                  '#ffffff', // Star White
                  '#a855f7', // Void Purple
                  '#3b82f6', // Deep Blue
                  '#f43f5e', // Nebula Red
                  '#10b981', // Aurora Green
                  '#f59e0b', // Solar Gold
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-all duration-300 ${
                      color === c 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-125 shadow-[0_0_10px_currentColor]' 
                        : 'opacity-50 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c, boxShadow: color === c ? `0 0 10px ${c}` : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out 0.2s backwards; }
      `}</style>
    </div>
  );
};

export default EditorOverlay;