import React from 'react';
import { Sliders, Layers, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { PresetKey } from '../types';

export default function SensoryControls({
  neoBlur,
  setNeoBlur,
  glassOpacity,
  setGlassOpacity,
  backdropBlur,
  setBackdropBlur,
  activePreset,
  setActivePreset,
  presets,
  onReset
}: {
  neoBlur: number;
  setNeoBlur: (val: number) => void;
  glassOpacity: number;
  setGlassOpacity: (val: number) => void;
  backdropBlur: number;
  setBackdropBlur: (val: number) => void;
  activePreset: PresetKey;
  setActivePreset: (val: PresetKey) => void;
  presets: any;
  onReset: () => void;
}) {
  return (
    <div 
      className="p-6 md:p-8 rounded-[2rem] space-y-6 text-left"
      style={{
        background: `rgba(255, 255, 255, ${Math.max(0.18, glassOpacity / 190)})`,
        backdropFilter: `blur(${backdropBlur}px)`,
        WebkitBackdropFilter: `blur(${backdropBlur}px)`,
        border: '1px solid rgba(255, 255, 255, 0.45)',
        boxShadow: '8px 8px 18px rgba(163, 177, 198, 0.3), -8px -8px 18px rgba(255, 255, 255, 0.4)'
      }}
    >
      <div className="border-b border-black/[0.05] pb-3">
        <h4 className="text-base font-heading font-black text-slate-800 uppercase tracking-wide">
          Ajustes Sensoriales y Accesibilidad
        </h4>
        <p className="text-[10px] text-slate-600 mt-1 leading-normal font-sans">
          Adapta el nivel de contraste tridimensional, brillo y difuminado cristalino para una lectura descansada, especialmente útil para adultos mayores.
        </p>
      </div>

      <div className="space-y-4">
        {/* Shadow slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-650 flex items-center gap-1.5 font-bold">
              <Sliders className="w-3.5 h-3.5 text-[#6C5CE7]" /> Contraste Neomórfico (Sombras)
            </span>
            <span className="font-mono text-[#6C5CE7] font-bold">{neoBlur}px</span>
          </div>
          <input 
            type="range" 
            min="4" 
            max="26" 
            value={neoBlur}
            onChange={(e) => setNeoBlur(Number(e.target.value))}
            className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-[#6C5CE7]"
          />
        </div>

        {/* Glass transparency slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-650 flex items-center gap-1.5 font-bold">
              <Layers className="w-3.5 h-3.5 text-pink-500" /> Opacidad Traslúcida (Frosting)
            </span>
            <span className="font-mono text-pink-500 font-bold">{glassOpacity}%</span>
          </div>
          <input 
            type="range" 
            min="15" 
            max="80" 
            value={glassOpacity}
            onChange={(e) => setGlassOpacity(Number(e.target.value))}
            className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        {/* Backdrop strength slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-650 flex items-center gap-1.5 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" /> Intensidad de Enfoque (Blur)
            </span>
            <span className="font-mono text-teal-650 font-bold">{backdropBlur}px</span>
          </div>
          <input 
            type="range" 
            min="4" 
            max="35" 
            value={backdropBlur}
            onChange={(e) => setBackdropBlur(Number(e.target.value))}
            className="w-full h-1.5 bg-black/[0.08] rounded-full appearance-none cursor-pointer accent-teal-600"
          />
        </div>

        {/* Preset switch */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-2 font-black">
            Luz Celestial Trasera
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(presets).map((key) => {
              const active = activePreset === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePreset(key as PresetKey)}
                  className={`text-[11px] px-3 py-2.5 rounded-xl transition-all duration-300 font-bold text-left flex items-center justify-between border ${
                    active 
                      ? 'border-[#6C5CE7]/30 bg-[#6C5CE7]/10 text-[#6C5CE7]' 
                      : 'border-black/[0.04] bg-black/[0.01] hover:bg-black/[0.03] text-slate-600'
                  }`}
                >
                  <span>{presets[key as PresetKey].name.split(' ')[1]}</span>
                  <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-tr ${presets[key as PresetKey].glowClass}`} />
                </button>
              );
            })}
          </div>
        </div>

        <button 
          type="button"
          onClick={onReset}
          className="w-full py-2.5 rounded-xl border border-dashed border-black/[0.08] hover:border-black/20 text-[10px] font-mono text-slate-550 hover:text-black transition-all flex items-center justify-center gap-1.5 mt-2"
        >
          <RefreshCw className="w-3 h-3" /> Restaurar Ajustes Iniciales
        </button>
      </div>

    </div>
  );
}
